const axios = require('axios');


exports.homeRoutes = (req, res) => {
    //Make a get request to /api/items
    axios.get('https://line-bot-ch.herokuapp.com/api/items')
        .then(function(response){
            res.render('product_view', { item : response });
        })
        .catch(err =>{
            res.send(err);
        })

    //res.render('index', { users : '' });
}

// exports.add_item = (req, res) =>{
//     res.render('add_item');
// }

// exports.update_user = (req, res) =>{
//     axios.get('https://line-bot-ch.herokuapp.com/api/items', { params : { id : req.query.id }})
//         .then(function(userdata){
//             res.render("update_user", { user : userdata.data})
//         })
//         .catch(err =>{
//             res.send(err);
//         })
// }