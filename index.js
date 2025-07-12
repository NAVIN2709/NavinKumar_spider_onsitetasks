const express = require("express")
const mongoose = require("mongoose")
const userRoutes = require("./routes/userRoutes")
const cors = require("cors")

const app = express();
app.use(cors());
app.use(express.json());

mongoose
  .connect("mongodb+srv://navinnitt2006:navin2006@jugaadpay.3k0orw3.mongodb.net/?retryWrites=true&w=majority&appName=JugaadPay")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

app.use("/api", userRoutes);

app.listen(3000, () => {
  console.log(`Server running on port 3000`);
});
