'use client';

import dynamic from "next/dynamic";
import React, { useEffect, useRef, useState } from "react";
// import Markdown from "react-markdown";
const Markdown = dynamic(() => import('react-markdown'), { ssr: false })
interface ExpandableMarkdownProps {
    text: string;
    className?: string;
    containerClassName?: string;
}

const LinkRenderer = ({ href, children }: { href: string } & React.PropsWithChildren) => {
    return (
        <a href={href} target="_blank" rel="noopener noreferrer">
            {children}
        </a>
    );
};

const ExpandableMarkdown: React.FC<ExpandableMarkdownProps> = ({
    text,
    className,
    containerClassName,
}) => {
    const [seeMore, setSeeMore] = useState(false);
    const descriptionRef = useRef<HTMLDivElement>(null);
    const [descriptionHeight, setDescriptionHeight] = useState(0);
    useEffect(() => {
        if (descriptionRef.current) {
            setDescriptionHeight(descriptionRef.current.clientHeight + 20);
        }
    }, [descriptionRef]);
    useEffect(() => {
        setSeeMore(false);
        if (descriptionRef.current) {
            setDescriptionHeight(descriptionRef.current.clientHeight + 20);
        }
    }, [text]);
    const MAX_HEIGHT = 142;

    return (
        <>
            <div
                className={`transition-all ease-out duration-250 left-[-12px] text-base leading-6 text-slate-11 mt-5 mb-7 overflow-hidden relative w-full pr-4 ${containerClassName}`}
                style={{
                    maxHeight: seeMore ? `${descriptionHeight}px` : `${MAX_HEIGHT}px`,
                }}
            >
                <div ref={descriptionRef}>
                    <Markdown
                        className={`markdown ${className}`}
                        components={{
                            a(props) {
                                return LinkRenderer({
                                    href: props.href!,
                                    children: props.children,
                                });
                            },
                        }}
                    >
                        {text}
                    </Markdown>

                    {!seeMore && descriptionHeight > MAX_HEIGHT ? (
                        <div className="border-b-2 border-slate-2 bg-gradient-to-b from-transparent to-slate-2 opacity-100 bg-blend-multiply h-5 w-[calc(100%+36px)] px-2 rounded-b-sm -mx-2 absolute bottom-0 left-0 z-50"></div>
                    ) : (
                        <></>
                    )}
                </div>
            </div>
            {descriptionHeight > MAX_HEIGHT ? (
                <div className="text-sm pb-4 -mt-5 relative z-50 bottom-0 right-0 text-right pr-4">
                    {seeMore ? (
                        <>
                            <span
                                className="font-semibold text-slate-12 cursor-pointer whitespace-nowrap hover:text-slate-11"
                                onClick={() => setSeeMore(false)}
                            >
                                see less
                            </span>
                        </>
                    ) : (
                        <>
                            <span
                                className="font-semibold text-slate-12 cursor-pointer whitespace-nowrap hover:text-slate-11"
                                onClick={() => setSeeMore(true)}
                            >
                                ...see more
                            </span>
                        </>
                    )}
                </div>
            ) : null}
        </>
    );
};

export default ExpandableMarkdown;
