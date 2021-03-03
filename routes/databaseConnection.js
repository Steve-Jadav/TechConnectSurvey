const neo4j = require("neo4j-driver");
const CONNECTION_URI = "bolt://localhost:7687";
const credentials = {
  "neo4j": {
    "user": "neo4j",
    "password": "neo4j_1234"
  }
};

let driver = neo4j.driver(
  CONNECTION_URI,
  neo4j.auth.basic(credentials.neo4j.user, credentials.neo4j.password)
);

let session = driver.session();

/* +++++++++=+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */

/**
* @param {String} nodeType
* @param {String} nodeTitle
* @param {String} rootNode
* @param {Array} childNodes
*/
async function insertRecords(nodeType, nodeTitle, rootNode, childNodes) {

  let flag = Boolean(false);

  try {
    // First check if the root node already exists in the database.
    let match = "MATCH (n:" + nodeType + " { name: $name }) RETURN n";
    let present = await session.run(match, { name: rootNode });

    if (present.records.length == 0) {
      let cypher = "CREATE (n:" + nodeType + " { name: $name, title: $title, email: $email }) RETURN n";

      let result = await session.run(
        cypher,
        { name: rootNode, title: nodeTitle, email: rootNode }
      );
      console.log("Created the root node!");
    }

    // Enter the child nodes and connect them with the root node
    for (const c of childNodes) {
      let cypher = "CREATE (n: ServiceProvider { name: $name, title: $title, email: $email }) RETURN n";
      let result = await session.run(
        cypher,
        { name: c, title: nodeTitle, email: c }
      );

      let relationshipCypher = "MATCH (a:" + nodeType + "), (b: ServiceProvider) WHERE a.name='" + rootNode + "' AND b.name='" + c + "' CREATE (a)-[r:WORKSWITH]->(b) RETURN type(r)";
      result = await session.run(relationshipCypher);
    }

    flag = Boolean(true);
  }
  finally {
    return flag;
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


/**
* @param {String} parentNode
* @param {String} childNode
* @param {String} relationshipType
*/
async function rosterInsert(parentNode, childNode, relationshipType) {
  let flag = Boolean(false);

  try {
    // First check if the root node already exists in the database.
    let match = "MATCH (n: Researcher { email: $email }) RETURN n";
    console.log(match);
    let present = await session.run(match, { email: parentNode });
    console.log(present);
    if (present.records.length == 0) {
      let cypher = "CREATE (n: Researcher { name: $name, title: $title, email: $email }) RETURN n";

      let result = await session.run(
        cypher,
        { name: "Ralph", title: parentNode, email: parentNode }
      );
      console.log("Created the parent node!");
    }

    // Check if the child node exists in the database
    match = "MATCH (n: ServiceProvider { email: $email }) RETURN n";
    present = await session.run(match, { email: childNode });

    if (present.records.length == 0) {
      cypher = "CREATE (n: ServiceProvider { name: $name, title: $title, email: $email }) RETURN n";

      result = await session.run(
        cypher,
        { name: "Steve", title: childNode, email: childNode }
      );
      console.log("Created the parent node!");
    }

      // Connect both the nodes
      let relationshipCypher = "MATCH (a: Researcher), (b: ServiceProvider) WHERE a.name='Ralph' AND b.name='Steve' CREATE (a)-[r:WORKSWITH { type: $type } ]->(b) RETURN type(r)";
      result = await session.run(relationshipCypher, { type: relationshipType });
      flag = Boolean(true);
    }

  finally {
    return flag;
  }
}

/* Export required functions */
module.exports = { insertRecords, fetchRecords, rosterInsert };
