const chaiHttp = require("chai-http");
const chai = require("chai");
const Product = require("../models/productModel");
const User = require("../models/userModel");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

process.env.NODE_ENV = "test";

const server = require("../server");
const { send } = require("@sendgrid/mail");
let mongoServer;

const expect = chai.expect;
chai.use(chaiHttp);

require("dotenv").config();

describe("PRODUCTS ENDPOINTS", () => {
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
    await createProducts();
    await createAdminUser();
    await createNormalUser();
  });

  afterEach(async () => {
    await removeProducts();
    await removeUsers();
  });
  describe(":GET", () => {
    describe("/products", () => {
      it("Should get all products", async () => {
        const res = await chai.request("localhost:5000/api").get("/products");
        expect(res.status).to.equal(200);
        expect(res.body).to.be.a("object");
        expect(res.body).to.have.property("products");
        expect(res.body).to.have.property("page");
        expect(res.body).to.have.property("pages");
        expect(res.body.products).to.be.a("array");
        expect(res.body.pages).to.be.a("number");
        expect(res.body.page).to.be.a("number");
        expect(res.body.page).to.be.equal(1);
        expect(res.body.pages).to.be.greaterThan(0);
      });
      it("Should get no products on empty table", async () => {
        await Product.deleteMany();
        const res = await chai.request("localhost:5000/api").get("/products");
        expect(res.status).to.equal(200);
        expect(res.body).to.be.a("object");
        expect(res.body).to.have.property("products");
        expect(res.body).to.have.property("page");
        expect(res.body).to.have.property("pages");
        expect(res.body.products).to.be.a("array");
        expect(res.body.pages).to.be.a("number");
        expect(res.body.page).to.be.a("number");
        expect(res.body.page).to.be.equal(1);
        expect(res.body.pages).to.be.equal(0);
      });
    });

    describe("/products/:id", () => {
      it("Should get product with id", async () => {
        const invalidId = "56cb91bdc3464f14678934c0";
        const res = await chai
          .request("localhost:5000/api")
          .get(`/products/${invalidId}`);

        expect(res.status).to.equal(200);
        expect(res.body).to.be.a("object");
        expect(res.body._id).to.be.a("string");
        expect(res.body._id).to.equal("56cb91bdc3464f14678934c0");
      });
      it("Should not get product with invalid id", async () => {
        const invalidId = "invalidId";
        const res = await chai
          .request("localhost:5000/api")
          .get(`/products/${invalidId}`);
        expect(res.status).to.equal(400);
        expect(res.body).to.be.a("object");
        expect(res.body).to.have.property("message");
        expect(res.body.message).to.be.a("string");
        expect(res.body.message).to.equal("Error: Invalid Id");
      });
      it("Should not get product with valid id that does not exist", async () => {
        const invalidId = "5febc36da0445d0a3e6eac54";
        const res = await chai
          .request("localhost:5000/api")
          .get(`/products/${invalidId}`);
        expect(res.status).to.equal(404);
        expect(res.body).to.be.a("object");
        expect(res.body).to.have.property("message");
        expect(res.body.message).to.be.a("string");
        expect(res.body.message).to.equal("Error: Product not found");
      });
    });

    describe("/products/top", () => {
      it("should get top 3 products", async () => {
        const res = await chai
          .request("localhost:5000/api")
          .get("/products/top");
        expect(res.status).to.equal(200);
        expect(res.body).to.be.a("array");
        expect(res.body).to.have.lengthOf(3);
      });
      it("should get top 2 products on collection with only 2 products", async () => {
        await Product.deleteMany({
          _id: [
            "56cb91bdc3464f14678934c0",
            "56cb91bdc3464f14678934c1",
            "56cb91bdc3464f14678934c2",
          ],
        });
        const res = await chai
          .request("localhost:5000/api")
          .get("/products/top");
        expect(res.status).to.equal(200);
        expect(res.body).to.be.a("array");
        expect(res.body).to.have.lengthOf(2);
      });
      it("should not get top 3 products with empty table", async () => {
        await Product.deleteMany();
        const res = await chai
          .request("localhost:5000/api")
          .get("/products/top");
        expect(res.status).to.equal(404);
        expect(res.body).to.be.a("object");
        expect(res.body).to.have.property("message");
      });
    });
  });

  describe(":POST", () => {
    describe("/products", () => {
      it("should create a sample product", async () => {
        // Create User
        const { token } = await loginUser("admin@example.com");
        const res = await chai
          .request("localhost:5000/api")
          .post("/products")
          .set("Authorization", `Bearer ${token}`);

        // Assertions
        expect(res.status).to.equal(201);
        expect(res.body).to.be.a("object");
        expect(res.body).to.have.property("_id");
        expect(res.body).to.have.property("name");
        expect(res.body).to.have.property("user");
        expect(res.body).to.have.property("brand");
        expect(res.body).to.have.property("category");
        expect(res.body).to.have.property("description");
        expect(res.body).to.have.property("image");
      });
      it("should not create a product without token", async () => {
        const res = await chai.request("localhost:5000/api").post("/products");

        // Assertions
        expect(res.status).to.equal(401);
        expect(res.body).to.be.a("object");
        expect(res.body).to.have.property("message");
        expect(res.body.message).to.equal("Not Authorized, no token");
      });
      it("should not create a product if user is not an admin", async () => {
        const { token } = await loginUser("notadmin@example.com");
        const res = await chai
          .request("localhost:5000/api")
          .post("/products")
          .set("Authorization", `Bearer ${token}`);

        // Assertions
        expect(res.status).to.equal(401);
        expect(res.body).to.be.a("object");
        expect(res.body).to.have.property("message");
        expect(res.body.message).to.equal("Not Authorized");
      });
      it("should not create a product if token is invalid", async () => {
        const token = "INVALID";
        const res = await chai
          .request("localhost:5000/api")
          .post("/products")
          .set("Authorization", `Bearer ${token}`);

        // Assertions
        expect(res.status).to.equal(401);
        expect(res.body).to.be.a("object");
        expect(res.body).to.have.property("message");
        expect(res.body.message).to.equal("Not authorized, token failed");
      });
    });
    describe("/products/:id/reviews", () => {
      it("should create a review with rating, comment, user", async () => {
        const { token } = await loginUser("notadmin@example.com");
        const id = "56cb91bdc3464f14678934c0";
        const review = {
          rating: 3,
          comment: "Good",
        };
        const res = await chai
          .request("localhost:5000/api")
          .post(`/products/${id}/reviews`)
          .set("Authorization", `Bearer ${token}`)
          .send(review);
      });
      it("should not create a review without rating", () => {});
      it("should not create a review without comment", () => {});
      it("should not create a review without logged in user", () => {});
      it("should not create a review if product already reviewed by logged in user", () => {});
    });
  });

  describe(":DELETE", () => {
    describe("/products/:id", () => {
      it("should delete product", () => {});
      it("should not delete product that does not exist", () => {});
      it("should not delete if without logged in user", () => {});
      it("should not delete if logged in user is not admin", () => {});
    });
  });

  describe(":PUT", () => {
    describe("/api/products/:id", () => {
      it("should update product", () => {});
      it("should not update product if id is invalid", () => {});
      it("should not update product if product does not exist", () => {});
      it("should not update product without logged in user", () => {});
      it("should not update product without name", () => {});
      it("should not update product without description", () => {});
      it("should not update product without category", () => {});
      it("should not update product without brand", () => {});
      it("should not update product without image", () => {});
      it("should not update product without price", () => {});
      it("should not update product without countInStock", () => {});
      it("should not update product if user is not admin", () => {});
    });
  });
});

const createProducts = async () => {
  for (let i = 0; i < 5; i++) {
    const product = new Product({
      _id: mongoose.Types.ObjectId(`56cb91bdc3464f14678934c${i}`),
      name: "Amazon Echo Dot 3rd Generation",
      image: "/images/alexa.jpg",
      description:
        "Meet Echo Dot - Our most popular smart speaker with a fabric design. It is our most compact smart speaker that fits perfectly into small space",
      brand: "Amazon",
      category: "Electronics",
      price: 29.99,
      countInStock: 0,
      rating: 4,
      user: mongoose.Types.ObjectId(),
      numReviews: 12,
    });
    await product.save();
  }
};

const removeProducts = async () => {
  await Product.deleteMany();
};

const createNormalUser = async () => {
  const user = await new User({
    name: "Not Admin User",
    email: "notadmin@example.com",
    password: "123456",
    isAdmin: false,
  }).save();
};

const createAdminUser = async () => {
  const user = await new User({
    name: "Admin User",
    email: "admin@example.com",
    password: "123456",
    isAdmin: true,
  }).save();
};

const removeUsers = async () => {
  await User.deleteMany();
};

const loginUser = async (email) => {
  const res = await chai
    .request("localhost:5000/api")
    .post("/users/login")
    .send({ email, password: "123456" });

  return res.body;
};
