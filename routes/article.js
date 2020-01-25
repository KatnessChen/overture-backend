var express = require('express');
var router = express.Router();
var firebaseDB = require('../connections/firebase_admin.js');
var articlesRef = firebaseDB.ref('/articles');
var categoriesRef = firebaseDB.ref('/categories');

/* GET home page. */
router.get('/', (req, res, next) => {
  let result = [];
  // console.log(articlesRef);

  articlesRef.orderByChild('timestamp').once('value').then((articles) => {
    categoriesRef.once('value').then((categories) => {
      const categoriesV = categories.val();
      articles.forEach((item) => {
        const article = item.val();
        result.push({
          id: article.id,
          title: article.title,
          content: article.content,
          timestamp: article.timestamp,
          categoryId: article.categoryId,
          categoryName: categoriesV[article.categoryId] ? categoriesV[article.categoryId].name : '錯誤', // 要拿到 category 的名稱
          status: article.status,
          heroImageBase64: article.heroImageBase64,
        });
      })
      res.send(result.reverse());
    })
  });
});

router.put('/update', (req, res, next) => {

  const title = req.body.title || '(Empty)';
  const content = req.body.content || '(Empty)';
  const categoryId = req.body.categoryId || '(Empty)';
  const timestamp = req.body.timestamp || '(Empty)';
  const articleId = req.body.articleId || '(Empty)';
  const status = req.body.status || 'draft';
  const heroImageBase64 = req.body.heroImageBase64 || '';

  articlesRef.child(articleId).update({ title, content, categoryId, timestamp, status, heroImageBase64 }).then(() => {
    res.send('post success');
  })
});

router.post('/', (req, res, next) => {
  const title = req.body.title || '(Empty)';
  const content = req.body.content || '(Empty)';
  const categoryId = req.body.categoryId || '-LwCRXT7ab4zYF-GzAlk';
  const timestamp = req.body.timestamp || '(Empty)';
  const status = req.body.status || 'draft';
  const heroImageBase64 = req.body.heroImageBase64 || '';

  const articleRef = articlesRef.push();
  const id = articleRef.key;
  articleRef.set({ title, content, categoryId, timestamp, id, status, heroImageBase64 }).then(() => {
    res.send('post success');
  })
});

router.delete('/delete', (req, res, next) => {
  const articleId = req.body.id;
  const articleRef = articlesRef.child(articleId);
  if (articleRef) {
    console.log('remove');
    articleRef.remove();
  }
});

module.exports = router;
