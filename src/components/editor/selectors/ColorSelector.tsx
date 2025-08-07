import { Check, ChevronDown } from "lucide-react";
import { useEditor } from "novel";
import { EditorBubbleItem } from "../bubble/editor-bubble-item";

import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
export interface BubbleColorMenuItem {
    name: string;
    color: string;
}

const TEXT_COLORS: BubbleColorMenuItem[] = [
    {
        name: "기본값",
        color: "#ffffff",
    },
    {
        name: "회색",
        color: "#9CA3AF",
    },
    {
        name: "분홍색",
        color: "#EC4899",
    },
    {
        name: "빨강색",
        color: "#EF4444",
    },
    {
        name: "주황색",
        color: "#F97316",
    },
    {
        name: "노랑색",
        color: "#EAB308",
    },
    {
        name: "초록색",
        color: "#22C55E",
    },
    {
        name: "파랑색",
        color: "#3B82F6",
    },
    {
        name: "보라색",
        color: "#A855F7",
    },
];

const HIGHLIGHT_COLORS: BubbleColorMenuItem[] = [
    {
        name: "기본값",
        color: "#374151",
    },
    {
        name: "회색",
        color: "#6B7280",
    },
    {
        name: "분홍색",
        color: "#BE185D",
    },
    {
        name: "빨강색",
        color: "#DC2626",
    },
    {
        name: "주황색",
        color: "#EA580C",
    },
    {
        name: "노랑색",
        color: "#CA8A04",
    },
    {
        name: "초록색",
        color: "#16A34A",
    },
    {
        name: "파랑색",
        color: "#2563EB",
    },
    {
        name: "보라색",
        color: "#9333EA",
    },
];

interface ColorSelectorProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export const ColorSelector = ({ open, onOpenChange }: ColorSelectorProps) => {
    const { editor } = useEditor();

    if (!editor) return null;
    const activeColorItem = TEXT_COLORS.find(({ color }) => editor.isActive("textStyle", { color }));

    const activeHighlightItem = HIGHLIGHT_COLORS.find(({ color }) => editor.isActive("highlight", { color }));

    return (
        <Popover modal={true} open={open} onOpenChange={onOpenChange}>
            <PopoverTrigger asChild>
                <Button size="sm" className="gap-2 rounded-lg px-3 py-1.5 text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-700/50 transition-all duration-200" variant="ghost">
                    <span
                        className="rounded-md px-1.5 py-0.5 font-medium"
                        style={{
                            color: activeColorItem?.color,
                            backgroundColor: activeHighlightItem?.color,
                        }}
                    >
                        A
                    </span>
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                </Button>
            </PopoverTrigger>

            <PopoverContent
                sideOffset={5}
                className="my-1 flex max-h-80 w-48 flex-col overflow-hidden overflow-y-auto rounded-xl border border-gray-600/50 p-2 shadow-2xl bg-gray-900/95 backdrop-blur-md"
                align="start"
            >
                <div className="flex flex-col">
                    <div className="my-1 px-2 text-sm font-semibold text-gray-400">글자색</div>
                    {TEXT_COLORS.map(({ name, color }) => (
                        <EditorBubbleItem
                            key={name}
                            onSelect={(editorInstance) => {
                                editorInstance.commands.unsetColor();
                                name !== "기본값" &&
                                    editorInstance
                                        .chain()
                                        .focus()
                                        .setColor(color || "")
                                        .run();
                                onOpenChange(false);
                            }}
                            className="flex cursor-pointer items-center justify-between px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-700/50 transition-all duration-200 rounded-lg"
                        >
                            <div className="flex items-center gap-2">
                                <div className="rounded-sm border px-2 py-px font-medium" style={{ color }}>
                                    A
                                </div>
                                <span style={{ color }}>{name}</span>
                            </div>
                        </EditorBubbleItem>
                    ))}
                </div>
                <div>
                    <div className="my-1 px-2 text-sm font-semibold text-gray-400">배경색</div>
                    {HIGHLIGHT_COLORS.map(({ name, color }) => (
                        <EditorBubbleItem
                            key={name}
                            onSelect={(editorInstance) => {
                                editorInstance.commands.unsetHighlight();
                                name !== "기본값" && editorInstance.chain().focus().setHighlight({ color }).run();
                                onOpenChange(false);
                            }}
                            className="flex cursor-pointer items-center justify-between px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-700/50 transition-all duration-200 rounded-lg"
                        >
                            <div className="flex items-center gap-2">
                                <div className="rounded-sm border px-2 py-px font-medium" style={{ backgroundColor: color }}>
                                    A
                                </div>
                                <span style={{ backgroundColor: color, color: "#ffffff", padding: "0.125rem 0.375rem", borderRadius: "0.25rem", fontSize: "0.75rem" }}>{name}</span>
                            </div>
                            {editor.isActive("highlight", { color }) && <Check className="h-4 w-4" />}
                        </EditorBubbleItem>
                    ))}
                </div>
            </PopoverContent>
        </Popover>
    );
};
