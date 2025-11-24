import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Blog API Documentation",
      version: "1.0.0",
      description: "API documentation for the Blog API with versioning (v1).",
    },
    servers: [
      {
        url: "http://localhost:3000/api/v1",
        description: "Development server",
      },
    ],

    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },

      schemas: {
        // ----------------- POSTS -----------------
        PostInput: {
          type: "object",
          required: ["title", "content"],
          properties: {
            title: { type: "string", example: "My First Blog Post" },
            content: { type: "string", example: "This is the content of the post." },
          },
        },
        PostResponse: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            title: { type: "string", example: "My First Blog Post" },
            content: { type: "string", example: "This is the content of the post." },
            authorId: { type: "integer", example: 1 },
            createdAt: { type: "string", example: "2025-11-22T12:34:56Z" },
          },
        },

        // ----------------- COMMENTS -----------------
        CommentInput: {
          type: "object",
          required: ["text"],
          properties: {
            text: { type: "string", example: "This post is very helpful!" },
          },
        },
        CommentResponse: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            text: { type: "string", example: "This post is very helpful!" },
            postId: { type: "integer", example: 1 },
            userId: { type: "integer", example: 1 },
            createdAt: { type: "string", example: "2025-11-22T12:34:56Z" },
          },
        },

        // ----------------- USERS -----------------
        UserInput: {
          type: "object",
          required: ["username", "password"],
          properties: {
            username: { type: "string", example: "crisjay" },
            password: { type: "string", example: "StrongP@ssword123!" },
          },
        },
        UserResponse: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            username: { type: "string", example: "crisjay" },
            email: { type: "string", example: "crisjay@example.com" },
            createdAt: { type: "string", example: "2025-11-22T12:34:56Z" },
          },
        },

        // ----------------- AUTH -----------------
        AuthResponse: {
          type: "object",
          properties: {
            token: { type: "string", example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." },
            user: { $ref: "#/components/schemas/UserResponse" },
          },
        },

        // ----------------- PHOTOS -----------------
        PhotoResponse: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            url: { type: "string", example: "http://localhost:3000/uploads/photo1.jpg" },
            userId: { type: "integer", example: 1 },
            createdAt: { type: "string", example: "2025-11-22T12:34:56Z" },
          },
        },

        // ----------------- ERROR -----------------
        ErrorResponse: {
          type: "object",
          properties: {
            status: { type: "integer", example: 400 },
            message: { type: "string", example: "Bad Request" },
          },
        },
      },
    },

    // Global security for all endpoints (can still override per-route)
    security: [{ bearerAuth: [] }],
  },

  // Points to all v1 route files for JSDoc scanning
  apis: ["./src/routes/v1/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
