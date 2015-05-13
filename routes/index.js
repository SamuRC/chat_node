
/*
 * GET home page.
 */

var brand = 'Hacom SAC';

exports.index = function(req, res){
    res.redirect('home');
};

exports.off_line = function(req, res){
    res.render('off_line', { title: 'Fuera de servicio', id: 'home', brand: brand })
};

exports.on_line = function(req, res){
    res.render('on_line', { title: 'En servicio', id: 'home', brand: brand })
};

exports.room = function(req, res){
    res.render('room', {title: 'Sala'+req.params.id, id: 'home', brand: brand})
};

exports.about = function(req, res){
    res.render('about', { title: 'About', id: 'about', brand: brand })
};

exports.sign_up = function(req, res){
    console.log(req.body);
};

exports.panel = function(req, res){
    var collection = db.get('room_collection');
    collection.find({},{},function(e,docs){
        res.render('panel', {
            "title": 'Lista de salas',
            "id": 'home',
            "brand": brand,
            "user_list" : docs
        });
    });
}

exports.operator = function(req, res){
    res.render('operator', { title: 'Inicio de sesión - OPERADOR', id: 'home', brand: brand })
}

