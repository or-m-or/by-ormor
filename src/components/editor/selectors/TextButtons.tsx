import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { BoldIcon, CodeIcon, ItalicIcon, StrikethroughIcon, UnderlineIcon } from "lucide-react";
import { useEditor } from "novel";
import { EditorBubbleItem } from "../bubble/editor-bubble-item";
import type { SelectorItem } from "./NodeSelector";

export const TextButtons = () => {
    const { editor } = useEditor();
    if (!editor) return null;
    const items: SelectorItem[] = [
        {
            name: "bold",
            isActive: (editor) => editor.isActive("bold"),
            command: (editor) => editor.chain().focus().toggleBold().run(),
            icon: BoldIcon,
        },
        {
            name: "italic",
            isActive: (editor) => editor.isActive("italic"),
            command: (editor) => editor.chain().focus().toggleItalic().run(),
            icon: ItalicIcon,
        },
        {
            name: "underline",
            isActive: (editor) => editor.isActive("underline"),
            command: (editor) => editor.chain().focus().toggleUnderline().run(),
            icon: UnderlineIcon,
        },
        {
            name: "strike",
            isActive: (editor) => editor.isActive("strike"),
            command: (editor) => editor.chain().focus().toggleStrike().run(),
            icon: StrikethroughIcon,
        },
        {
            name: "code",
            isActive: (editor) => editor.isActive("code"),
            command: (editor) => editor.chain().focus().toggleCode().run(),
            icon: CodeIcon,
        },
    ];
    return (
        <div className="flex">
            {items.map((item) => (
                <EditorBubbleItem
                    key={item.name}
                    onSelect={(editor) => {
                        item.command(editor);
                    }}
                >
                    <Button size="sm" className="rounded-lg px-2 py-1.5 text-gray-300 hover:text-white hover:bg-gray-700/50 transition-all duration-200" variant="ghost" type="button">
                        <item.icon
                            className={cn("h-4 w-4", {
                                "text-purple-400": item.isActive(editor),
                            })}
                        />
                    </Button>
                </EditorBubbleItem>
            ))}
        </div>
    );
};
