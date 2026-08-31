"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface CircuitNode {
  id: string;
  x: number;
  y: number;
  label?: string;
  labelPosition?: "top" | "bottom" | "left" | "right";
  icon?: React.ReactNode;
  status?: "active" | "inactive" | "processing" | "error";
  size?: "sm" | "md" | "lg";
}

export interface CircuitConnection {
  from: string;
  to: string;
  animated?: boolean;
  bidirectional?: boolean;
  color?: string;
  pulseColor?: string;
}

export interface CircuitBoardProps extends React.HTMLAttributes<HTMLDivElement> {
  nodes: CircuitNode[];
  connections: CircuitConnection[];
  width?: number;
  height?: number;
  gridSize?: number;
  showGrid?: boolean;
  gridColor?: string;
  traceColor?: string;
  pulseColor?: string;
  nodeColor?: string;
  pulseSpeed?: number;
  traceWidth?: number;
}

export function CircuitBoard({
  nodes,
  connections,
  width = 500,
  height = 240,
  gridSize = 20,
  showGrid = true,
  gridColor = "rgba(255, 255, 255, 0.05)",
  traceColor = "rgba(255, 75, 23, 0.4)",
  pulseColor = "#ffffff",
  nodeColor = "rgba(255, 255, 255, 0.9)",
  pulseSpeed = 2.5,
  traceWidth = 2,
  className,
  ...props
}: CircuitBoardProps) {
  const nodeMap = React.useMemo(() => {
    return new Map(nodes.map((node) => [node.id, node]));
  }, [nodes]);

  const getNodeSize = React.useCallback((size?: CircuitNode["size"]) => {
    switch (size) {
      case "sm":
        return 28;
      case "lg":
        return 48;
      default:
        return 38;
    }
  }, []);

  const calculatePath = React.useCallback(
    (from: CircuitNode, to: CircuitNode): string => {
      const fromSize = getNodeSize(from.size) / 2 + 2;
      const toSize = getNodeSize(to.size) / 2 + 2;

      const dx = to.x - from.x;
      const dy = to.y - from.y;

      let startX = from.x;
      let startY = from.y;
      let endX = to.x;
      let endY = to.y;

      if (Math.abs(dx) > Math.abs(dy)) {
        startX = from.x + (dx > 0 ? fromSize : -fromSize);
        endX = to.x + (dx > 0 ? -toSize : toSize);
        const midX = from.x + dx / 2;
        return `M ${startX} ${startY} H ${midX} V ${endY} H ${endX}`;
      } else {
        startY = from.y + (dy > 0 ? fromSize : -fromSize);
        endY = to.y + (dy > 0 ? -toSize : toSize);
        const midY = from.y + dy / 2;
        return `M ${startX} ${startY} V ${midY} H ${endX} V ${endY}`;
      }
    },
    [getNodeSize]
  );

  return (
    <div className={cn("relative w-full max-w-[500px] mx-auto overflow-hidden", className)} {...props}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-auto block overflow-visible select-none"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          {/* Pulse Glow Filter */}
          <filter id="circuit-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Grid pattern */}
          {showGrid && (
            <pattern
              id="circuit-grid"
              width={gridSize}
              height={gridSize}
              patternUnits="userSpaceOnUse"
            >
              <circle cx={gridSize / 2} cy={gridSize / 2} r="0.75" fill={gridColor} />
            </pattern>
          )}
        </defs>

        {/* Grid Background */}
        {showGrid && (
          <rect width={width} height={height} fill="url(#circuit-grid)" rx="16" />
        )}

        {/* Connection Traces */}
        {connections.map((conn, i) => {
          const fromNode = nodeMap.get(conn.from);
          const toNode = nodeMap.get(conn.to);
          if (!fromNode || !toNode) return null;

          const path = calculatePath(fromNode, toNode);
          const pathLength = 400;

          return (
            <g key={`connection-${i}`}>
              {/* Base Trace Line */}
              <motion.path
                d={path}
                fill="none"
                stroke={conn.color || traceColor}
                strokeWidth={traceWidth}
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.8, delay: i * 0.15 }}
              />

              {/* Animated Light Pulse */}
              {conn.animated !== false && (
                <motion.path
                  d={path}
                  fill="none"
                  stroke={conn.pulseColor || pulseColor}
                  strokeWidth={traceWidth + 2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  filter="url(#circuit-glow)"
                  strokeDasharray={`${pathLength * 0.12} ${pathLength * 0.88}`}
                  initial={{ strokeDashoffset: pathLength }}
                  animate={{ strokeDashoffset: -pathLength }}
                  transition={{
                    duration: pulseSpeed,
                    repeat: Infinity,
                    ease: "linear",
                    delay: i * 0.3,
                  }}
                />
              )}
            </g>
          );
        })}

        {/* Nodes (Rendered directly in vector space) */}
        {nodes.map((node) => {
          const size = getNodeSize(node.size);
          const halfSize = size / 2;
          const iconSize = 18;
          const halfIcon = iconSize / 2;

          // Label Y calculations
          const isTop = node.labelPosition === "top";
          const labelY = isTop ? node.y - halfSize - 8 : node.y + halfSize + 16;

          return (
            <g key={node.id} className="cursor-default">
              {/* Outer Glow Halo */}
              <rect
                x={node.x - halfSize - 2}
                y={node.y - halfSize - 2}
                width={size + 4}
                height={size + 4}
                rx={10}
                fill="none"
                stroke="rgba(255, 75, 23, 0.2)"
                strokeWidth="1"
              />

              {/* Node Background Box */}
              <rect
                x={node.x - halfSize}
                y={node.y - halfSize}
                width={size}
                height={size}
                rx={8}
                fill="#0e0e0e"
                stroke="rgba(255, 255, 255, 0.2)"
                strokeWidth="1.5"
              />

              {/* Icon Container (Using foreignObject for React Icon) */}
              {node.icon && (
                <foreignObject
                  x={node.x - halfIcon}
                  y={node.y - halfIcon}
                  width={iconSize}
                  height={iconSize}
                  className="pointer-events-none"
                >
                  <div className="w-full h-full flex items-center justify-center text-white">
                    {node.icon}
                  </div>
                </foreignObject>
              )}

              {/* Label Text (100% aligned and cannot overlap) */}
              {node.label && (
                <text
                  x={node.x}
                  y={labelY}
                  textAnchor="middle"
                  fill="#ffffff"
                  fontSize="11"
                  fontWeight="600"
                  fontFamily="monospace"
                  letterSpacing="0.08em"
                  className="select-none"
                >
                  {node.label}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
