function buildCharts(id) {
    // read in data
    d3.json("Data/samples.json").then((data)=> {
        console.log(data)
        
        // need to create wash frequency, samples, sample values, and OTU variables
        // need to find top 10 OTU samples and values

        var wfreq = data.metadata.map(d => d.wfreq)
        console.log(wfreq)

        var samples = data.samples.filter(s => s.id.toString() === id)[0];
        console.log(samples);
  
        var samplevalues = samples.sample_values.slice(0, 10).reverse();
        console.log(samplevalues)

        var OTU_top = (samples.otu_ids.slice(0, 10)).reverse();
        console.log(OTU_top)

        var OTU_id = OTU_top.map(d => "OTU " + d)
        console.log(OTU_id)

        var labels = samples.otu_labels.slice(0, 10);
        console.log(labels)
        
        // bar chart
        var trace = {
            x: samplevalues,
            y: OTU_id,
            text: labels,
            marker: {
              color: 'red'},
            type:"bar",
            orientation: "h",
        };
  
        var data = [trace];
  
        var layout = {
            title: "Most Common Bacteria Found",
            yaxis:{
                tickmode:"linear",
            },
        };
  
        Plotly.newPlot("bar", data, layout);
      
        // bubble chart
        var trace_b = {
            x: samples.otu_ids,
            y: samples.sample_values,
            mode: "markers",
            marker: {
                size: samples.sample_values,
                color: samples.otu_ids
            },
            text: samples.otu_labels
  
        };

        var layout_b = {
            xaxis:  {
                title: "OTU ID"
            },
            yaxis: {
                title: "Sample Values"
            },
        };

        var data_b = [trace_b];

        Plotly.newPlot("bubble", data_b, layout_b); 

      });
  }  

function metaData(id) {
    // read in data
    d3.json("Data/samples.json").then((data)=> {
        
        // set variable and log to console
        var metadata = data.metadata;
        console.log(metadata)

        // set variable and log to console
        var result = metadata.filter(meta => meta.id.toString() === id)[0];
        console.log(result)

        // set variable and log to console
        var demoInfo = d3.select("#sample-metadata");
        console.log(demoInfo)

        // clear exisiting
        demoInfo.html("");

        Object.entries(result).forEach((key) => {   
            demoInfo.append("h5").text(key[0].toUpperCase() + ": " + key[1] + "\n");    
        });
    });
}

// change event
function optionChanged(id) {
    buildCharts(id);
    metaData(id);
}

// start
function init() {
    var dropdownMenu = d3.select("#selDataset");

    // read data into console as first step
    d3.json("Data/samples.json").then((data)=> {
        console.log(data)

        data.names.forEach(function(name) {
            dropdownMenu.append("option").text(name).property("value");
        });

        buildCharts(data.names[0]);
        metaData(data.names[0]);
    });
}

init();