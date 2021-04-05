const getUuid = require("uuid-by-string");
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
* @param {String} childNodes
*/
async function rosterInsert(parentNode, childNodes) {
  let flag = Boolean(false);

  try {
    // First check if the parent node already exists in the database using the nodeId.
    let match = "MATCH (n) WHERE n.nodeId = '" + parentNode.nodeId + "' RETURN n";
    console.log(match);
    
    let present = await session.run(match);
    console.log(present);
    
    let properties =  { firstname: parentNode.firstName, lastname: parentNode.lastName, jobTitle: parentNode.jobTitle, 
      specialityAreas: parentNode.specialityAreas, companyName: parentNode.companyName, joiningDate: parentNode.joiningDate,
      organizationRole: parentNode.organizationRole, noOfPeople: parentNode.noOfPeople };

    // Create the parent node if it doesn't exist.
    if (present.records.length == 0) {
      let cypher = "CREATE (n: " + parentNode.jobTitle + " { firstname: $firstname, lastname: $lastname, jobTitle: $jobTitle, specialityAreas: $specialityAreas, companyName: $companyName, joiningDate: $joiningDate, organizationRole: $organizationRole, noOfPeople: $noOfPeople }) RETURN n";
      let result = await session.run( cypher, properties );
      console.log("Created the parent node!");
    }
    // If it exists, it exists as a 'Supervisor' node. Verify the node attributes. If some of them are missing try to update them.
    else {
      // Check if it exists as a 'Supervisor' node. In that case, add new properties to the node.
      cypher = "MATCH (n: Supervisor {nodeId: $nodeId}) SET n.firstname = $firstname, n.lastname = $lastname, n.jobTitle = $jobTitle, n.specialityAreas = $specialityAreas, n.companyName = $companyName, n.joiningDate = $joiningDate, n.organizationRole = $organizationRole, n.noOfPeople = $noOfPeople";
      result = await session.run( cypher, properties );
      console.log("Updated the properties of a supervisor node.");
    }

    // Check if the supervisor nodes exist in the database. If False, then add them to the graph with relationship = 'supervisor'
    let supervisors = childNodes.supervisors.split(",").map(x => x.trim());
    for (var i = 0; i < supervisors.length; i++) {
      let id = getUuid(supervisors[i]);
      match = "MATCH (n) WHERE n.nodeId = '" + id + "' RETURN n";
      present = await session.run(match);

      if (present.records.length == 0) {
        cypher = "CREATE (n: Supervisor { name: $name, nodeId: $nodeId }) RETURN n";

        result = await session.run(
          cypher,
          { name: supervisors[i], nodeId: id }
        );
        console.log("Created the supervisor node!");
      }

      // Connect both the nodes (parent and supervisor)
      let relationshipCypher = "MATCH (a), (b: Supervisor) WHERE a.nodeId='" + parentNode.nodeId + "' AND b.nodeId='" + id + "' CREATE (a)-[r:HAS_SUPERVISOR { type: $type } ]->(b) RETURN type(r)";
      result = await session.run(relationshipCypher, { type: "supervisor" });

    }

    // Check if the contact nodes exist in the database. If False, then add them to the graph.
    for (const [key, value] of Object.entries(childNodes.section2)) {
      let contacts = childNodes.section2.key;
      for (var i = 0; i < contacts.length; i++) {
        let contact = contacts[i];
        if (contact.name == "" && contact.org == "" && contact.relationship == "")
          continue;
        id = getUuid(contact.name);
        match = "MATCH (n) WHERE n.nodeId = '" + id + "' RETURN n";
        present = await session.run(match);

        if (present.records.length == 0) {
          cypher = "CREATE (n: ContactNode { name: $name, nodeId; $nodeId, organization: $organization }) RETURN n";
          result = await session.run(
            cyper,
            { name: contact.name, nodeId: id, organization: contact.org }
          );
          console.log("Created the contact node");
          
          // Connect both the nodes (parent and supervisor)
          let relationshipCypher = "MATCH (a), (b: ContactNode) WHERE a.nodeId='" + parentNode.nodeId + "' AND b.nodeId='" + id + "' CREATE (a)-[r:CONTACTS_" + contact.contactFrequency.toUpperCase() + " { type: $type } ]->(b) RETURN type(r)";
          result = await session.run(relationshipCypher, { type: "contact" });

        }

      }
    }
    
    flag = Boolean(true);
  }

  finally {
    return flag;
  }
}

/* Export required functions */
module.exports = { insertRecords, fetchRecords, rosterInsert };
