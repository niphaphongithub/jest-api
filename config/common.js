import supertest from "supertest";
import config from "../config/config";
const request = supertest(config.baseUrl);

export default request;