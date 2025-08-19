const request = require("supertest");
const app = require("../src/app");
const { default: mongoose } = require("mongoose");

describe("Health Check API", () => {
  it("should be able to return OK", async () => {
    const res = await request(app).get("/health");
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ message: "OK" });
  });
});

describe("Note API", () => {
  it("should be able to create new note with validation", async () => {
    const resPost = await request(app)
      .post("/api/notes")
      .set("Authorization", "Bearer 1fd03fbad85c26e557e044724fb281f0")
      .send({
        title: "Hello",
        body: "Ship me later",
        releaseAt: new Date().toISOString(),
        webhookUrl: "http://sink:4000/sink",
      });

    expect(resPost.statusCode).toBe(201);
  });
});

afterAll(async () => {
  await mongoose.connection.close(); // <- closes DB cleanly
});
