const axios = require('axios');


exports.homeRoutes = (req, res) => {
    //Make a get request to /api/items
    axios.get('https://line-bot-ch.herokuapp.com/api/items')
        .then(function(response){
            console.log(response.data)
            res.render('product_view',{response: response.data});
        })
        .catch(err =>{
            res.send(err);
        })

    //res.render('index', { users : '' });
}

exports.add_item = (req, res) =>{
    console.log('do add_item')
    res.render('product_view');
}

// exports.update_user = (req, res) =>{
//     axios.get('https://line-bot-ch.herokuapp.com/api/items', { params : { id : req.query.id }})
//         .then(function(userdata){
//             res.render("update_user", { user : userdata.data})
//         })
//         .catch(err =>{
//             res.send(err);
//         })
// }