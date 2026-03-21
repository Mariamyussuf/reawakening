import { Book, BookCategory } from "@/models/Book";

export class BookService {
    private extractBooks(payload: any): any[] {
        if (Array.isArray(payload?.books)) {
            return payload.books;
        }

        if (Array.isArray(payload?.data?.books)) {
            return payload.data.books;
        }

        return [];
    }

    private extractBook(payload: any): any | null {
        if (payload?.book) {
            return payload.book;
        }

        if (payload?.data?.book) {
            return payload.data.book;
        }

        return null;
    }

    // Get all books
    async getAllBooks(): Promise<Book[]> {
        try {
            const response = await fetch('/api/books');
            if (!response.ok) throw new Error('Failed to fetch books');
            const data = await response.json();
            return this.extractBooks(data).map(this.formatBook);
        } catch (error) {
            console.error('Error fetching books:', error);
            return [];
        }
    }

    // Get book by ID
    async getBookById(id: string): Promise<Book | null> {
        try {
            const response = await fetch(`/api/books/${id}`);
            if (!response.ok) {
                if (response.status === 404) return null;
                throw new Error('Failed to fetch book');
            }
            const data = await response.json();
            const book = this.extractBook(data);
            return book ? this.formatBook(book) : null;
        } catch (error) {
            console.error('Error fetching book:', error);
            return null;
        }
    }

    // Get books by category
    async getBooksByCategory(category: BookCategory): Promise<Book[]> {
        try {
            const response = await fetch(`/api/books?category=${encodeURIComponent(category)}`);
            if (!response.ok) throw new Error('Failed to fetch books by category');
            const data = await response.json();
            return this.extractBooks(data).map(this.formatBook);
        } catch (error) {
            console.error('Error fetching books by category:', error);
            return [];
        }
    }

    // Get featured books
    async getFeaturedBooks(): Promise<Book[]> {
        try {
            const response = await fetch('/api/books?featured=true&limit=10');
            if (!response.ok) throw new Error('Failed to fetch featured books');
            const data = await response.json();
            return this.extractBooks(data).map(this.formatBook);
        } catch (error) {
            console.error('Error fetching featured books:', error);
            return [];
        }
    }

    // Get popular books
    async getPopularBooks(): Promise<Book[]> {
        try {
            const response = await fetch('/api/books?popular=true&sortBy=views&sortOrder=desc&limit=10');
            if (!response.ok) throw new Error('Failed to fetch popular books');
            const data = await response.json();
            return this.extractBooks(data).map(this.formatBook);
        } catch (error) {
            console.error('Error fetching popular books:', error);
            return [];
        }
    }

    // Get new releases
    async getNewReleases(): Promise<Book[]> {
        try {
            const response = await fetch('/api/books?newRelease=true&sortBy=createdAt&sortOrder=desc&limit=10');
            if (!response.ok) throw new Error('Failed to fetch new releases');
            const data = await response.json();
            return this.extractBooks(data).map(this.formatBook);
        } catch (error) {
            console.error('Error fetching new releases:', error);
            return [];
        }
    }

    // Search books
    async searchBooks(query: string): Promise<Book[]> {
        try {
            const response = await fetch(`/api/books/search?q=${encodeURIComponent(query)}`);
            if (!response.ok) throw new Error('Failed to search books');
            const data = await response.json();
            return this.extractBooks(data).map(this.formatBook);
        } catch (error) {
            console.error('Error searching books:', error);
            return [];
        }
    }

    // Increment view count
    async incrementViews(bookId: string): Promise<void> {
        try {
            await fetch(`/api/books/${bookId}/view`, {
                method: 'POST',
            });
        } catch (error) {
            console.error('Error incrementing views:', error);
        }
    }

    // Increment download count
    async incrementDownloads(bookId: string): Promise<{ pdfUrl: string } | null> {
        try {
            const response = await fetch(`/api/books/${bookId}/download`, {
                method: 'POST',
            });
            if (!response.ok) throw new Error('Failed to increment downloads');
            const data = await response.json();
            return { pdfUrl: data.pdfUrl };
        } catch (error) {
            console.error('Error incrementing downloads:', error);
            return null;
        }
    }

    // Helper method to format book from API response
    private formatBook(book: any): Book {
        return {
            id: book.id,
            title: book.title,
            author: book.author,
            description: book.description,
            coverImage: book.coverImage,
            pdfUrl: book.pdfUrl,
            fileSize: book.fileSize,
            pageCount: book.pageCount,
            categories: book.categories,
            tags: book.tags,
            publishYear: book.publishYear,
            publisher: book.publisher,
            isbn: book.isbn,
            language: book.language,
            difficulty: book.difficulty,
            featured: book.featured,
            popular: book.popular,
            newRelease: book.newRelease,
            totalDownloads: book.totalDownloads,
            totalViews: book.totalViews,
            averageRating: book.averageRating,
            createdAt: new Date(book.createdAt),
            updatedAt: new Date(book.updatedAt),
        };
    }

    // Get all categories
    getAllCategories(): BookCategory[] {
        return Object.values(BookCategory);
    }

    // Get category display name
    getCategoryDisplayName(category: BookCategory): string {
        return category;
    }
}

// Export singleton instance
export const bookService = new BookService();
