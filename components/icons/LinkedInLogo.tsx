import * as React from "react";

export function LinkedInLogo({ size = 24, className }: { size?: number; className?: string }) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			width={size}
			height={size}
			fill="currentColor"
			className={className}
			aria-hidden="true"
		>
			<path d="M22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.226.792 24 1.771 24h20.454C23.2 24 24 23.226 24 22.271V1.729C24 .774 23.2 0 22.225 0zM7.017 20.452H3.72V9h3.297v11.452zM5.37 7.433a2.062 2.062 0 110-4.123 2.062 2.062 0 010 4.123zM20.452 20.452h-3.297v-5.73c0-1.365-.028-3.122-1.902-3.122-1.903 0-2.194 1.487-2.194 3.024v5.828H9.762V9h3.165v1.566h.044c.441-.835 1.52-1.712 3.13-1.712 3.346 0 3.951 2.203 3.951 5.066v6.532z"/>
		</svg>
	);
}
