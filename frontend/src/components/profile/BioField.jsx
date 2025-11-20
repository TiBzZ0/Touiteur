export default function BioField({ content }) {
    return (
        <p style={{ whiteSpace: 'pre-wrap', wordBreak: "break-word"}} className="text-[color:var(--foreground)] text-sm sm:text-base leading-normal mb-2 mt-4">
            {content}
        </p>
    );
}
