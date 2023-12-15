const Note = require('../models/Notes');
const mongoose = require('mongoose');

exports.dashboard = async (req, res) => {
  //Oka page ki 12 notes
 let perPage = 12;
  // url nundi page number get chesko ani em lekunte default  ga 1 ante first page
 let page = req.query.page || 1;
 const locals = {
   title: "Dashboard",
   description: "Free Notes",
   userName: req.isAuthenticated() ? req.user.firstName : "",
 };

 try {
   //console.log("Local User ID:", req.user.id); // Print local user ID
//aggregate function is used to make operations on the database
   const notes = await Note.aggregate([
     {
        //descending order lo dates
       $sort: {
         updatedAt: -1,
       },
     },
     {
         //user id ki related ante current user create chesinavi filter cheseki
       $match: {
         user: new mongoose.Types.ObjectId(req.user.id),
       },
     },
     {
        //title and body thaginchi charaters display cheseki
       $project: {
         title: { $substr: ['$title', 0, 30] },
         body: { $substr: ['$body', 0, 100] },
       },
     },
   ])
    //already notes pafe lo unte avi skip chey
     .skip(perPage * page - perPage)
     //limit ga print cheseki
     .limit(perPage)
      //aggregate function nni exec cheseki oka function
     .exec();

   const count = await Note.countDocuments({ user: req.user.id }).exec();

   //console.log("Matched User ID:", req.user.id); // Print matched user ID

   res.render('dashboard/index', {
     userName: locals.userName,
     locals,
     notes,
     layout: '../views/layouts/dashboard',
     current: page,
     pages: Math.ceil(count / perPage),
   });
 } catch (error) {
   console.error(error);
   res.status(500).json({ message: 'Server error' });
 }
};

/**
 * Get Specific Note
 */
exports.dashboardViewNote=async(req,res)=>
{
const note=await Note.findById({_id:req.params.id})
.where({user:req.user.id})
//used to convert into plain text
.lean();
if(note){
  res.render('dashboard/view-note',{
    noteId:req.params.id,
    note,
    layout:'../views/layouts/dashboard'
  });
}else{
  res.send("Something is Wrong");
}

}
/**
 * PUT
 * Update the Specific note
 */
exports.dashboardUpdateNote = async (req, res) => {
  try {
    await Note.findByIdAndUpdate(
      { _id: req.params.id },
      { title: req.body.title, body: req.body.body,updatedAt:Date.now() }
    ).where({ user: req.user.id });
    res.redirect("/dashboard");
  } catch (error) {
    console.log(error);
  }
};
/*
 * Delete the specific Note
 */
exports.dashboardDeleteNote = async (req, res) => {
  try {
    await Note.deleteOne({ _id: req.params.id }).where({ user: req.user.id });
    res.redirect("/dashboard");
  } catch (error) {
    console.log(error);
  }
};
/**
 * Add Note
 */
exports.dashboardAddNote=async(req,res)=>
{
 res.render("dashboard/add",
 {
  layout:'../views/layouts/dashboard'
 });
 }
/**
 * Note Submit
 */
exports.dashboardAddNoteSubmit=async(req,res)=>
{
  try {
    req.body.user=req.user.id;
    await Note.create(req.body);
    res.redirect('/dashboard')
  } catch (error) {
    console.log(error);
  }
}

/**
 * GET /
 * Search
 */
exports.dashboardSearch = async (req, res) => {
  try {
    res.render("dashboard/search", {
      searchResults: "",
      layout: "../views/layouts/dashboard",
    });
  } catch (error) {}
};

/**
 * POST /
 * Search For Notes
 */
exports.dashboardSearchSubmit = async (req, res) => {
  try {
    let searchTerm = req.body.searchTerm;
    //special characters emaina unte theeseyadaniki (/[^a-zA-Z0-9 ]/g, "")
    const searchNoSpecialChars = searchTerm.replace(/[^a-zA-Z0-9 ]/g, "");

    const searchResults = await Note.find({
      //database query or ante edaina oka condition true aithe
      $or: [
        //This is the first condition. It looks for notes where the title field contains a case-insensitive match to the searchNoSpecialChars value.
        { title: { $regex: new RegExp(searchNoSpecialChars, "i") } },
        { body: { $regex: new RegExp(searchNoSpecialChars, "i") } },
      ],
    }).where({ user: req.user.id });

    res.render("dashboard/search", {
      searchResults,
      layout: "../views/layouts/dashboard",
    });
  } catch (error) {
    console.log(error);
  }
};



// chatgpt code 
/**
exports.dashboard = async (req, res) => {
  //Oka page ki 12 notes
  let perPage=12;
  // url nundi page number get chesko ani em lekunte default  ga 1 ante first page
  let page=req.query.page || 1
    const locals = {
        title: "Dashboard",
        description: "Free Notes",
        userName: req.isAuthenticated() ? req.user.firstName : "",
      };

      try {
        //aggregate function is used to make operations on the database
        Note.aggregate([
          {
            //descending order lo dates
            $sort:{
              createdAt:-1,
            }
          },
          //user id ki related ante current user create chesinavi filter cheseki
          {$match:{user:new mongoose.Types.ObjectId(req.user.id)}},
          {
            $project:{
              //title and body thaginchi charaters display cheseki
              title:{$substr:['$title',0,30]},
              body:{$substr:['$body',0,100]}
            }
          }
        ])
        //already notes pafe lo unte avi skip chey
        .skip(perPage * page - perPage)
        //Oka page ki 12 matrame undali ani
        .limit(perPage)
        //aggregate function nni exec cheseki oka function
        .then((notes) => {
          // Use the notes here
        
          // Now, count the total number of users for the current user
          return Note.countDocuments().exec();
        })
        .then((count) => {
          // Handle the count of documents here
          res.render('dashboard/index', {
            userName: locals.userName,
            locals,
            notes,
            layout: '../views/layouts/dashboard',
            current: page,
            //total notes thiskoni per page ki enni display cheyali ani chepthundi
            pages: Math.ceil(count / perPage),
          });
        })
        .catch((err) => {
          // Handle any errors here
          console.error(err);
          // You might want to send an error response to the client
          res.status(500).json({ message: 'Server error' });
        });
       //console.log(notes[1])
      } catch (error) {
        console.log(error)
      }
     // console.log('userName:', locals.userName); Add this line to check userName
    
      
  
};
 */
// updated mongoose data
/**
 * const Note = require('../models/Notes');
const mongoose = require('mongoose');

exports.dashboard = async (req, res) => {
  let perPage = 12;
  let page = req.query.page || 1;
  const locals = {
    title: "Dashboard",
    description: "Free Notes",
    userName: req.isAuthenticated() ? req.user.firstName : "",
  };

  try {
    const notesQuery = Note.aggregate([
      {
        $sort: {
          createdAt: -1,
        }
      },
      {
        $match: {
          user: new mongoose.Types.ObjectId(req.user.id),
        }
      },
      {
        $project: {
          title: { $substr: ['$title', 0, 30] },
          body: { $substr: ['$body', 0, 100] }
        }
      }
    ])
    .skip(perPage * page - perPage)
    .limit(perPage)
    .exec();

    const countQuery = Note.countDocuments({ user: req.user.id }).exec();

    // Execute both queries in parallel using Promise.all
    const [notes, count] = await Promise.all([notesQuery, countQuery]);

    res.render('dashboard/index', {
      userName: locals.userName,
      locals,
      notes,
      layout: '../views/layouts/dashboard',
      current: page,
      pages: Math.ceil(count / perPage),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
 */


//mongoose without update code

//  exports.dashboard = async (req, res) => {
//   let perPage=12;
//   let page=req.query.page || 1
//     const locals = {
//         title: "Dashboard",
//         description: "Free Notes",
//         userName: req.isAuthenticated() ? req.user.firstName : "",
//       };

//       try {
//         Note.aggregate([
//           {
//             $sort:{
//               createdAt:-1,
//             }
//           },
//           {$match:{user:new mongoose.Types.ObjectId(req.user.id)}},
//           {
//             $projext:{
//               title:{$substr:['$title',0,30]},
//               body:{$substr:['$body',0,100]}
//             }
//           }
//         ])
//         .skip(perPage * page - perPage)
//         .limit(perPage)
//         .exec(function(err,notes){
//           Note.count().exec(function(err,count){
//             if(err) return next(err )
//              //  const notes= await Note.find({})
//        res.render('dashboard/index', {
//         userName: locals.userName,
//         locals,
//         notes,
//         layout: '../views/layouts/dashboard',
//         current:page,
//         pages:Math.ceil(count / perPage)
//           })
//         })

     
//       });
//        //console.log(notes[1])
//       } catch (error) {
//         console.log(error)
//       }
//      // console.log('userName:', locals.userName); Add this line to check userName
      
// }
 

