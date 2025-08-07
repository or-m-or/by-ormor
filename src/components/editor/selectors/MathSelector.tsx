import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { SigmaIcon } from "lucide-react";
import { useEditor } from "novel";
import type { EditorInstance } from "novel";
import { EditorBubbleItem } from "../bubble/editor-bubble-item";

export const MathSelector = () => {
    const { editor } = useEditor();

    if (!editor) return null;

    return (
        <EditorBubbleItem
            onSelect={(editor) => {
                const editorInstance = editor as EditorInstance;
                if (editorInstance.isActive("math")) {
                    editorInstance.chain().focus().unsetLatex().run();
                } else {
                    const { from, to } = editorInstance.state.selection;
                    const latex = editorInstance.state.doc.textBetween(from, to);

                    if (!latex) return;

                    editorInstance.chain().focus().setLatex({ latex }).run();
                }
            }}
        >
            <Button
                variant="ghost"
                size="sm"
                className="rounded-lg w-12 px-3 py-1.5 text-gray-300 hover:text-white hover:bg-gray-700/50 transition-all duration-200"
            >
                <SigmaIcon
                    className={cn("size-4", { "text-purple-400": editor.isActive("math") })}
                    strokeWidth={2.3}
                />
            </Button>
        </EditorBubbleItem>
    );
};
