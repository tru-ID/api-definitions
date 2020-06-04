const $RefParser = require("@apidevtools/json-schema-ref-parser");
const fs = require('fs');
const child_process = require('child_process')

const openApiSpecLocation = __dirname + '/../console/projects/openapi.v1.yaml'
const buildTargetDirectory = `${__dirname}/out`
const generatedJsonOpenApiSpecLocation = `${buildTargetDirectory}/dereferenced-openapi.json`
const fromJsonGeneratedJava = buildTargetDirectory + '/from-json'
const fromYamlGeneratedJava = buildTargetDirectory + '/from-yaml'

function clean() {
  console.log('Cleaning build')
  try {
    fs.rmdirSync(buildTargetDirectory, { recursive: true });
  }
  catch(err) {
    console.error('Error attempting to delete generated Java directories')
    console.error(err)
  }
}

function build() {
  console.log('Running build')

  fs.mkdirSync(buildTargetDirectory)

  $RefParser.dereference(openApiSpecLocation, (err, schema) => {
    if (err) {
      console.error(err);
    }
    else {
      let data = JSON.stringify(schema, null, 4);
      fs.writeFileSync(generatedJsonOpenApiSpecLocation, data);

      try {
        console.log('Generating Java from JSON')
        const resultFromJson = child_process.execSync(`openapi-generator generate -g spring -i ${generatedJsonOpenApiSpecLocation} -o ${fromJsonGeneratedJava} --additional-properties=hateoas=true`)

        console.log(resultFromJson.toString())
      }
      catch(error) {
        console.error('Error creating generated Java code from dereferenced OpenAPI JSON')
        console.error(error)
      }

      try {
        console.log('Generating Java from YAML')
        const resultFromYaml = child_process.execSync(`openapi-generator generate -g spring -i ${openApiSpecLocation} -o ${fromYamlGeneratedJava} --additional-properties=hateoas=true`)

        console.log(resultFromYaml.toString())
      }
      catch(error) {
        console.error('Error creating generated Java code from OpenAPI YAML')
        console.error(error)
      }
    }
  })
}

if(process.argv[2] === "clean") {
  clean()
}
else {
  clean()
  build()
}