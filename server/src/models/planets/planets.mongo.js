import mongoose from "mongoose";

const planetSchema = new mongoose.Schema({
  keplerName: {
    type: String,
    required: true,
  },
});

// Export with ES modules
export default mongoose.model('Planet', planetSchema);
