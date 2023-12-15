/**
 * GET /
 * Homepage 
*/
exports.homepage = async (req, res) => {
    const locals = {
      title: "NodeJs Notes",
      description: "Free NodeJS Notes App.",
    }
    res.render('index', {
      locals,
      layout: '../views/layouts/front-page'
    });
  }

/**
 * About page
 */
exports.about=async(req,res)=>
{
    const locals={
        title:"About -Naaaloni Bhavalu",
        description:"Free Notes"
    }
    res.render('about',locals)
}