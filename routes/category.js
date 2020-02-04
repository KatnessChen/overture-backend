var express = require('express');
var router = express.Router();
var firebaseDB = require('../connections/firebase_admin.js');
var categoriesRef = firebaseDB.ref('/categories');

var { checkAuthority } = require('../authority');

router.get('/', (req, res, next) => {
  let result = [];
  categoriesRef.once('value').then((snapshot) => {
    const categories = snapshot.val();
    for (item in categories) {
      result.push({
        id: item,
        name: categories[item].name
      })
    }
    // console.log(result);
    res.send(result);
  })
});

router.post('/', checkAuthority, (req, res, next) => {
  const name = req.body.name || '(Empty)';
  categoriesRef.push({
    name
  })
  res.send('post success');
});

router.delete('/delete', checkAuthority, (req, res, next) => {
  // TODO 後端可能要再驗證一次
  const categoryId = req.body.categoryId;
  const categoryRef = categoriesRef.child(categoryId);
  if (categoryRef) {
    categoryRef.remove().then(() => {
      res.send();
    });
  }
})

router.put('/rename', checkAuthority, (req, res, next) => {
  const categoryId = req.body.categoryId;
  const categoryName = req.body.categoryName;
  console.log(categoryId, categoryName);
  const categoryRef = categoriesRef.child(categoryId);
  if (categoryRef) {
    categoryRef.update({
      name: categoryName,
    }).then(() => {
      res.send();
    });
  }
})

module.exports = router;