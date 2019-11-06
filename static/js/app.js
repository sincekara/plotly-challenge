function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // fetching data for sample
  var diversity_data = `/metadata/${sample}`;
  // selecting panel with d3 and using .html function to clear data
  d3.json(diversity_data).then((sample) => {
    var diversity_data2 = d3.select("#sample-metadata");

    diversity_data2.html("");

    //`Object entries 
    Object.entries(sample).forEach(([key, value]) => {
      var row = diversity_data2.append("bio");
      row.text(`${key}:${value}`)
    })
  });
}

function buildCharts(sample) {
  var bio_graph = `/samples/${sample}`;
  // Fetchig sample data for plots, building bubble chart and pie chart
    d3.json(bio_graph).then((data) => {
      var colonies = data.sample_values;
      var colors = data.otu_ids;

      var frame = [{
        x: data.otu_ids,
        y: data.sample_values,
        mode: "markers",
        marker: {size: colonies, color: colors}
      }];

    var layout = {title: "Belly_Button Culture Diversity", xasis: {title: "OTU_ID" }};

    Plotly.newPlot("bubble", frame, layout);

    d3.jason(bio_graph).then((data) => {
      var frame_new = {
        values: data.sample_values.slice(0, 10),
        lables: data.otu_ids,
        type: "pie",
      };
      var data = [frame_new];
      var layout = {
        title: "Interactive Figure",
      };

      Plotly.newPlot("pie", data, layout);
    });
  });
};

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();

