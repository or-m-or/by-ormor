import { Button } from "@/components/ui/button";
import { PopoverContent } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Popover, PopoverTrigger } from "@radix-ui/react-popover";
import { Check, Trash } from "lucide-react";
import { useEditor } from "novel";
import { useEffect, useRef } from "react";

export function isValidUrl(url: string) {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}
export function getUrlFromString(str: string) {
    if (isValidUrl(str)) return str;
    try {
        if (str.includes(".") && !str.includes(" ")) {
            return new URL(`https://${str}`).toString();
        }
    } catch {
        return null;
    }
}
interface LinkSelectorProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export const LinkSelector = ({ open, onOpenChange }: LinkSelectorProps) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const { editor } = useEditor();

    // Autofocus on input by default
    useEffect(() => {
        inputRef.current?.focus();
    });
    if (!editor) return null;

    return (
        <Popover modal={true} open={open} onOpenChange={onOpenChange}>
            <PopoverTrigger asChild>
                <Button size="sm" variant="ghost" className="gap-2 rounded-lg px-2 py-1.5 text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-700/50 transition-all duration-200">
                    <p className="text-base">↗</p>
                    <p
                        className={cn("underline decoration-gray-500 underline-offset-4", {
                            "text-purple-400": editor.isActive("link"),
                        })}
                    >
                        Link
                    </p>
                </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-60 p-0 rounded-xl border-0 shadow-2xl bg-gray-900/95 backdrop-blur-md" sideOffset={10}>
                <form
                    onSubmit={(e) => {
                        const target = e.currentTarget as HTMLFormElement;
                        e.preventDefault();
                        const input = target[0] as HTMLInputElement;
                        const url = getUrlFromString(input.value);
                        if (url) {
                            editor.chain().focus().setLink({ href: url }).run();
                            onOpenChange(false);
                        }
                    }}
                    className="flex p-2"
                >
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="Paste a link"
                        className="flex-1 bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-sm text-gray-300 placeholder-gray-500 outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        defaultValue={editor.getAttributes("link").href || ""}
                    />
                    {editor.getAttributes("link").href ? (
                        <Button
                            size="icon"
                            variant="outline"
                            type="button"
                            className="flex h-8 items-center rounded-lg p-1 text-red-400 transition-all hover:bg-red-500/20 hover:text-red-300"
                            onClick={() => {
                                editor.chain().focus().unsetLink().run();
                                if (inputRef.current) {
                                    inputRef.current.value = "";
                                }
                                onOpenChange(false);
                            }}
                        >
                            <Trash className="h-4 w-4" />
                        </Button>
                    ) : (
                        <Button size="icon" className="h-8 rounded-lg bg-purple-600 hover:bg-purple-700 text-white">
                            <Check className="h-4 w-4" />
                        </Button>
                    )}
                </form>
            </PopoverContent>
        </Popover>
    );
};
