# Design First

Plan architecture before implementation. Make the plan so clear anyone could follow it.

## The Pattern

Before writing code:
1. Sketch the architecture
2. Document the approach
3. Get approval on the design
4. Then implement

## Examples

### ❌ Bad: Code First

```typescript
// User asks: "Add file upload to posts"
// You immediately start coding:

router.post('/posts/:id/upload', upload.single('file'), async (req, res) => {
  const file = req.file;
  // Wait, where do we store it? S3? Local disk?
  // What about validation? Size limits?
  // What about existing files? Replace or keep?
  // What about virus scanning?
```

### ✅ Good: Design First

```markdown
## File Upload Design

**Requirements:**
- Accept images (JPEG, PNG) up to 5MB
- Store in S3 bucket: posts-uploads
- Validate dimensions: 100x100 min, 4096x4096 max
- Scan for malware before storing
- Replace existing post image if present

**Flow:**
1. Validate: file type, size, dimensions
2. Generate unique filename: `${postId}-${uuid}.${ext}`
3. Scan with ClamAV
4. Upload to S3
5. Delete old file if exists
6. Update post.imageUrl in DB

**Error cases:**
- Invalid type → 400 "Only JPEG/PNG allowed"
- Too large → 413 "Max 5MB"
- Virus detected → 400 "File failed security scan"
- S3 failure → 500 "Upload failed, try again"

**Implementation:**
- Middleware: multer with memoryStorage (don't touch disk)
- Service: uploadPostImage(postId, buffer, mimetype)
- Tests: valid upload, size limit, type validation, replaces old
```

Now implement with clarity.

## Real Example: API Design

```typescript
// ❌ Bad: Start coding without design

export async function getUsers(filters: any) {
  // What filters are supported?
  // What's the response shape?
  // Is this paginated?
  // What about sorting?
}

// ✅ Good: Design the API first

/**
 * Get Users API Design
 *
 * GET /api/users?page=1&limit=20&role=admin&search=john&sort=createdAt:desc
 *
 * Query params:
 * - page: number (default: 1)
 * - limit: number (default: 20, max: 100)
 * - role: 'admin' | 'user' (optional)
 * - search: string (searches name, email)
 * - sort: 'createdAt:asc|desc' | 'name:asc|desc'
 *
 * Response: {
 *   data: User[],
 *   pagination: {
 *     page: number,
 *     limit: number,
 *     total: number,
 *     totalPages: number
 *   }
 * }
 *
 * Errors:
 * - 400: Invalid query params
 * - 401: Not authenticated
 * - 403: Not authorized (admin only)
 */

export async function getUsers(options: UserQueryOptions): Promise<UserListResponse> {
  // Now the signature is clear from the design
}
```

## When to Design First

Always design first for:
- New features (anything beyond trivial bug fixes)
- API endpoints (shape affects clients)
- Database schema changes (migrations are hard to reverse)
- Architecture decisions (DI, caching, state management)
- Complex algorithms (sorting, searching, parsing)

## Planning Template

```markdown
## [Feature Name]

**Goal:** What problem are we solving?

**Approach:** How will we solve it? (1-2 paragraphs)

**API/Interface:** Function signatures, types, endpoints

**Data Flow:** Input → Processing → Output

**Error Handling:** What can go wrong? How to handle?

**Testing:** What cases to cover?

**Trade-offs:** What did we choose not to do? Why?
```
