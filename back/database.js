import mysql from "mysql2/promise";

import { databaseSecret } from "./secret.js";

export const pool = mysql.createPool(databaseSecret);
