const chaiHttp = require("chai-http");
const chai = require("chai");
const User = require("../models/userModel");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

require("../server");
let mongoServer;

const expect = chai.expect;
chai.use(chaiHttp);

require("dotenv").config();

describe("USERS ENDPOINTS", () => {
  before(async () => {
    mongoServer = new MongoMemoryServer();
    const mongoUri = await mongoServer.getUri();
    await mongoose.connect(mongoUri, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useCreateIndex: true,
    });
  });

  after(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    await createUsers();
  });

  afterEach(async () => {
    await removeUsers();
  });
  describe(":GET", () => {
    describe("/users", () => {});
    describe("/users/:id", () => {});
    describe("/profile", () => {});
  });
  describe(":POST", () => {
    describe("/users", () => {});
    describe("/login", () => {
      it("should log user in with email & password", async () => {
        const res = await chai
          .request("localhost:5000/api")
          .post("/users/login")
          .send({ email: "admin0@example.com", password: "123456" });

        expect(res.status).to.equal(200);
        expect(res.body).to.be.a("object");
        expect(res.body).to.have.property("token");
        expect(res.body).to.have.property("_id");
        expect(res.body).to.have.property("name");
        expect(res.body).to.have.property("email");
        expect(res.body).to.have.property("isAdmin");
      });
      it("should not log user in with wrong password", async () => {
        const res = await chai
          .request("localhost:5000/api")
          .post("/users/login")
          .send({ email: "admin0@example.com", password: "123" });

        expect(res.status).to.equal(401);
        expect(res.body).to.be.a("object");
        expect(res.body).to.have.property("message");
        expect(res.body.message).to.equal("Invalid email or password");
      });
      it("should not log user in if email not registered", async () => {
        const res = await chai
          .request("localhost:5000/api")
          .post("/users/login")
          .send({ email: "notexist@example.com", password: "123" });

        expect(res.status).to.equal(401);
        expect(res.body).to.be.a("object");
        expect(res.body).to.have.property("message");
        expect(res.body.message).to.equal("Invalid email or password");
      });
      it("should not log user in without email & password", async () => {
        const res = await chai
          .request("localhost:5000/api")
          .post("/users/login")
          .send({});

        expect(res.status).to.equal(401);
        expect(res.body).to.be.a("object");
        expect(res.body).to.have.property("message");
        expect(res.body.message).to.equal("Invalid email or password");
      });
      it("should not log user in with only password", async () => {
        const res = await chai
          .request("localhost:5000/api")
          .post("/users/login")
          .send({ password: "123" });

        expect(res.status).to.equal(401);
        expect(res.body).to.be.a("object");
        expect(res.body).to.have.property("message");
        expect(res.body.message).to.equal("Invalid email or password");
      });
      it("should not log user in with only email", async () => {
        const res = await chai
          .request("localhost:5000/api")
          .post("/users/login")
          .send({ email: "notexist@example.com" });

        expect(res.status).to.equal(401);
        expect(res.body).to.be.a("object");
        expect(res.body).to.have.property("message");
        expect(res.body.message).to.equal("Invalid email or password");
      });
    });
  });
  describe(":DELETE", () => {
    describe("/users/:id", () => {});
  });
  describe(":PUT", () => {
    describe("/users/:id", () => {});
    describe("/profile", () => {});
  });
});

const createUsers = async () => {
  for (let i = 0; i < 5; i++) {
    const user = new User({
      _id: mongoose.Types.ObjectId(`57cb91bdc3464f14678934d${i}`),
      name: "Admin User",
      email: `admin${i}example.com`,
      password: "123456",
      isAdmin: i === 0,
    });

    await user.save();
  }
};

const removeUsers = async () => {
  await User.deleteMany();
};
