const express = require("express");
const neo4j = require("neo4j-driver");
const router = express.Router();

const URI = "bolt://localhost:7687";
const credentials = {
  "neo4j": {
    "user": "neo4j",
    "password": "neo4j_1234"
  }
};

let driver = neo4j.driver(
  URI,
  neo4j.auth.basic(credentials.neo4j.user, credentials.neo4j.password)
);

let session = driver.session();

router.get("/", function(req, res) {
  let cypher = "MATCH (n:Researcher) RETURN n LIMIT 25";
  let nodeCreationCypher = "CREATE (n:Researcher { name: $name, title: $title }) RETURN n";
  insertRecords(nodeCreationCypher, "", "", "");
  /*fetchRecords(cypher)
    .then(result => {
      res.send(result);
    }); */
});

/**
* @param {String} cypher
* @param {String} nodeType
* @param {String} nodeTitle
* @param {String} nodeEmail
*/
async function insertRecords(cypher, nodeType, nodeTitle, nodeEmail) {
  try {
    const result = await session.run(
      cypher,
      { name: "Ralph", title: "Researcher at NW TechBridge" }
    );
  }
  finally {

  }
}


/**
* @param {String} cypher
*/
async function fetchRecords(cypher) {
  let nodes = new Array();
  try {
    const result = await session.run(cypher);
    result.records.forEach(record => {
      const node = record.get(0);
      nodes.push(node);
    });
  }
  finally {
    //await session.close();
  }
  //await driver.close();
  return nodes;
}

module.exports = router;
