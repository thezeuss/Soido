const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    category: {
        type: String,
        required: [
          true,
          "please select category from- cow, baffalo, Ox, Bull",
        ],
        enum: {
            values: ["Cow", "Buffalo", "Ox", "Bull"],
          message:
          "please select category ONLY from - cow, baffalo, Ox or Bull ",
        },
      },
//   cattletype: {
//     type: String,
//     required: [
//       true,
//       "please select category from- cow, baffalo, Ox, Bull",
//     ],
//     enum: {
//       values: ["Cow", "Baffalo", "Ox", "Bull"],
//       message:
//         "please select category ONLY from - cow, baffalo, Ox or Bull ",
//     },
//   },

  breedType: {
    type: String,
    required: [
      true,
      "Select the breed of your cattle!",
    ]
  },

  cattleAge: {
    type: Number,
    required: [true, "please provide cattle age"],
    maxlength: [2, "Age not valid"],
  },

  lactationcycle: {
    type: Number,
    // required: [true, "please mention the no of Lactation cycles!"],
    maxlength: [1, " User selects from dropdown"],
  },

  currentMilkyield: {
    type: Number,
    // required: [true, "please mention current Milk Yield!"],
    maxlength: [2, ""],
  },

  averageMilkyield: {
    type: Number,
    // required: [true, "please mention average Milk Yield!"],
    maxlength: [2, ""],
  },

  pregnant: {
    type: Boolean,
    // required: [true, "Please mention if your cow is pregnant or not"]
  },

  price: {
    type: Number,
    required: [true, "please mention the Selling Price of the Cattle!"],
    // minlength: [, ""],
  },


  
  
  photos: [
    {
      id: {
        type: String,
        required: true,
      },
      secure_url: {
        type: String,
        required: true,
      },
    },
  ],

  description: {
    type: String,
    required: [true, "please provide product description"],
  },


//   uploader: {
       
//         user: {
//             type: mongoose.Schema.ObjectId,
//             ref: 'User',
//             required: true
//         },

//         createdAt: {
//             type: Date,
//             default: Date.now,
//         }
       
//   }

  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },

  
  //this field was updated in order videos later
//   stock: {
//     type: Number,
//     required: [true, "Plese"],
//   },
//   brand: {
//     type: String,
//     required: [true, "please add a brand for clothing"],
//   },
//   ratings: {
//     type: Number,
//     default: 0,
//   },
//   numberOfReviews: {
//     type: Number,
//     default: 0,
//   },
//   reviews: [
//     {
//       user: {
//         type: mongoose.Schema.ObjectId,
//         ref: "User",
//         required: true,
//       },
//       name: {
//         type: String,
//         required: true,
//       },
//       rating: {
//         type: Number,
//         required: true,
//       },
//       comment: {
//         type: String,
//         required: true,
//       },
//     },
//   ],
//   user: {
//     type: mongoose.Schema.ObjectId,
//     ref: "User",
//     required: true,
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },
});

module.exports = mongoose.model("Product", productSchema);
