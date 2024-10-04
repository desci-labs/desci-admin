import { cn } from "@/lib/utils";

function NodesLogo({ className }: { className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            x="0px"
            y="0px"
            viewBox="0 0 1000 1000"
            className={cn("w-9 h-9", className)}
        >
            <g transform="matrix( 1, 0, 0, 1, 705.8,9.5) ">
                <g>
                    <path
                        fill="none"
                        strokeWidth="45"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M-445.8,536.6l80,46.2v92.4l-80,46.2l-80-46.2l0-92.4L-445.8,536.6v-92.4l80-46.1
            			c-0.2-61.9-0.2-123.5,0-184.8l159.9-92.3l160,92.4v184.6l80,46.2v92.4l80,46.2v92.3l-80,46.2l-80-46.2l0.1-92.3l79.9-46.2
                        M-205.8,675.2l-80,46.2v92.4l80,46.2l80-46.2v-92.3L-205.8,675.2V490.5l-160-92.4 M-45.8,398.1l-160,92.4"
                    />
                </g>
            </g>
        </svg>
    );
}

export default NodesLogo;
