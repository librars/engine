/** Andrea Tino - 2020 */

/**
 * Tokens for DocBook syntax.
 */
export class DocbookTokens {
    /** Open tag for book. */
    public static DOCBOOK_BOOK_OPEN_TAG_TOKEN = "<book>";

    /** Closing tag for book. */
    public static DOCBOOK_BOOK_CLOSE_TAG_TOKEN = "</book>";

    /** Open tag for paragraph. */
    public static DOCBOOK_PARAGRAPH_OPEN_TAG_TOKEN = "<para>";

    /** Closing tag for paragraph. */
    public static DOCBOOK_PARAGRAPH_CLOSE_TAG_TOKEN = "</para>";

    /**
     * Open tag for section.
     * @param id The id to assign.
     */
    public static DOCBOOK_SECTION_OPEN_TAG_TOKEN = (id: string): string => `<section xml:id="${id}">`;

    /** Closing tag for section. */
    public static DOCBOOK_SECTION_CLOSE_TAG_TOKEN = "</section>";

    /** Open tag for title. */
    public static DOCBOOK_TITLE_OPEN_TAG_TOKEN = "<title>";

    /** Closing tag for title. */
    public static DOCBOOK_TITLE_CLOSE_TAG_TOKEN = "</title>";
}
