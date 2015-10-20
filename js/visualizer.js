/**
 *  visualizer.js
 *  -------------
 *  Author: Nick Francisci
 *  
 *  The javascript (es6, transpiled to es5 by babel) which
 *  creates the visualization.
 */




// -- CONSTANT DEFINITIONS -- // 

// Useful groupings of categories
const GROUPS = {
  Total: ["Total"],
  Age: ["18-29", "30-49", "50-64", "65+"],
  Gender: ["Men", "Women"],
  Education: ["High School", "Some College", "College"],
  Race: ["White, Non-Hispanic", "Black, Non-Hispanic", "Hispanic"],
  Income: ["Less than 30000", "30000-49999", "50000-74999", "More than 75000"],
  Community: ["Urban", "Suburban", "Rural"],
};

// Set of platforms in data
const PLATFORMS = [
  "Tumblr",
  "Facebook",
  "Pinterest",
  "Instagram",
  "LinkedIn",
  "Twitter",
];

// Intial parameter settings 
// NOTE: the es6 const definition allows object attributes to be changed,
// just not for the variable to be redefined. These attributes ARE changed
// frequently by the code.
const parameters = {
  platform: PLATFORMS,
  category: GROUPS.Total,
}




// -- FUNCTION DEFINITIONS -- //

/**
 * Retreives data filtered down to the passed parameters.
 * Parameters may be either a single string, or an array of strings.
 * Capitalization must be exact. An empty parameter object will
 * return all available data unfiltered.
 * 
 * @param {Object} An object of keyword arguments to specify
 *                    the filter to apply to the data. Valid
 *                    keywords are platform and category
 */
function getDataWhere({platform = null, category = null}) {
  return data.filter((datum) => {
    if (platform !== null) {
      // If the platform parameter is an array, and the
      // datum is not in the array, filter it out
      if (
        Array.isArray(platform) &&
        platform.indexOf(datum.platform) === -1
      ) return false;

      // If the platform parameter is string, and the
      // datum does not match the string, filter it out
      if (
        !Array.isArray(platform) &&
        platform !== datum.platform
      ) return false;
    };

    if (category !== null) {

      // If the category parameter is an array, and the
      // datum is not in the array, filter it out
      if (
        Array.isArray(category) &&
        category.indexOf(datum.category) === -1
      ) return false;

      // If the category parameter is string, and the
      // datum does not match the string, filter it out
      if (
        !Array.isArray(category) &&
        datum.category !== category
      ) return false;
    };

    // Otherwise, allow the datum to pass through the filter
    return true;
  });
};

/**
 * Given a parameters object, generates the charts from start to finish
 * @param {Object} parameters The platform and category filters
 */
function generateCharts(parameters) {
  
  // Get a selector based on the submitted platforms parameter
  const t1 = d3.select("#visualizer")
    .selectAll(".platformGroup")
    .data(parameters.platform, d => JSON.stringify(d));
  
  // Clear previous platform GROUPS
  t1.exit().remove();
  
  // Create a row for each platform
  t1.enter()
    .append("div")
    .classed({platformGroup: true})
    .attr({
      id: d => 'platform-group-' + d,
  });

  // Create the items and their nested elements within each platformGroup
  let t2;
  let item;
  parameters.platform.forEach(p => {
    
    // Get a selector based on the platform and category parameters
    t2 = d3.select("#visualizer")
      .selectAll("#" + 'platform-group-' + p)
      .selectAll(".item")
      .data(getDataWhere({
        platform: p,
        category: parameters.category,
      }), d => JSON.stringify(d));
    
    // Clear previous items
    t2.exit().remove();
    
    // Create a new item and get a selector for it
    item = t2.enter().append("div").classed({item: true});
    
    // Add the label to the item
    item.append("div")
      .classed({itemLabel: true})
      .text(d => d.category + ", " + d.value + "%");

    // Add the circular chart to the item
    item.append("div").classed({iconBound: true})
      .style({
        // Calculate the area of the dotted circle based on
        // a theoretical 100% value
        width: Math.sqrt(parseInt(100) / Math.PI) * 18,
        height: Math.sqrt(parseInt(100) / Math.PI) * 18,
      })
      .append("div").classed({iconCircle: true})
      .style({
        // Calculate the area of the solid white circle based
        // on the value of the datum
        width: d => Math.sqrt(parseInt(d.value) / Math.PI) * 18,
        height: d => Math.sqrt(parseInt(d.value) / Math.PI) * 18,
      })
      .append("i").attr({
        // Specify the icon to be used (via font-awesome)
        class: d => "icon fa fa-fw fa-" + d.platform.toLowerCase(),
      });
  });
};




// -- RUNNING CODE -- //
const pc = d3.select("#platformControl");

// Create platfrom controls
pc.append("button")
  .text("All")
  .attr({
    id: "platform-all"
  })
  .on("click", () => {
    pc.selectAll("button").classed({selected: false});
    parameters.platform = PLATFORMS;
    generateCharts(parameters);
    pc.select("#platform-all").classed({selected: true});
  });

pc.selectAll(".control")
  .data(PLATFORMS)
  .enter()
  .append("button").classed({control: true})
  .attr({
    id: d => "platform-" + d,
  })
  .on("click", (d) => {
    pc.selectAll("button").classed({selected: false});
    parameters.platform = [d];
    generateCharts(parameters);
    pc.select("#platform-" + d).classed({selected: true});
  })
  .text(d => d)


// Create category controls
const cc = d3.select("#categoryControl");

cc.selectAll(".control")
  .data(Object.keys(GROUPS))
  .enter()
  .append("button").classed({control: true})
  .attr({
    id: d => "category-" + d
  })
  .on("click", (d) => {
    cc.selectAll("button").classed({selected: false});
    parameters.category = GROUPS[d];
    generateCharts(parameters);
    cc.select("#category-" + d).classed({selected: true})
  })
  .text(d => d)

// Run initial setup by generating charts and selecting corresponding buttons
generateCharts({
  platform: PLATFORMS,
  category: GROUPS.Total,
});

pc.select("#platform-All").classed({selected: true});
cc.select("#category-Total").classed({selected: true});
