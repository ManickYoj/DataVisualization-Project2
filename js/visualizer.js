/**
 *  visualizer.js
 *  -------------
 *  Author: Nick Francisci
 *  
 *  The javascript (es6, transpiled to es5 by babel) which
 *  creates the visualization.
 */

// Useful groupings of categories
const groups = {
  Total: ["Total"],
  Age: ["18-29", "30-49", "50-64", "65+"],
  Gender: ["Men", "Women"],
  Education: ["High School", "Some College", "College"],
  Race: ["White, Non-Hispanic", "Black, Non-Hispanic", "Hispanic"],
  Income: ["Less than 30000", "30000-49999", "50000-74999", "More than 75000"],
  Community: ["Urban", "Suburban", "Rural"],
};

// Set of platforms in data
const platforms = [
  "Tumblr",
  "Facebook",
  "Pinterest",
  "Instagram",
  "LinkedIn",
  "Twitter",
];

let parameters = {
  platform: platforms,
  category: groups.Total,
}

/**
 * Retreives data which matches the passed parameter object.
 * Available parameters are platform and category, which
 * may be either a single string, or an array of strings.
 * Capitalization must be exact. An empty object will return
 * all available data.
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

function generateCharts(parameters) {
  
  // Create a div for each platform
  const t1 = d3.select("#visualizer")
    .selectAll(".platformGroup")
    .data(parameters.platform, d => JSON.stringify(d));
  
  t1.exit().remove();
  
  t1.enter()
    .append("div")
    .classed({platformGroup: true})
    .attr({
      id: d => 'platform-group-' + d,
  });

  //
  let t2;
  let item;
  parameters.platform.forEach(p => {
    t2 = d3.select("#visualizer")
      .selectAll("#" + 'platform-group-' + p)
      .selectAll(".item")
      .data(getDataWhere({
        platform: p,
        category: parameters.category,
      }), d => JSON.stringify(d));
    
    t2.exit().remove();
    
    item = t2.enter().append("div").classed({item: true});
    
    item.append("div")
      .classed({itemLabel: true})
      .text(d => d.category + ", " + d.value + "%");

    item.append("div").classed({iconBound: true})
      .style({  
        width: Math.sqrt(parseInt(100) / Math.PI) * 18,
        height: Math.sqrt(parseInt(100) / Math.PI) * 18,
      })
      .append("div").classed({iconCircle: true})
      .style({  
        width: d => Math.sqrt(parseInt(d.value) / Math.PI) * 18,
        height: d => Math.sqrt(parseInt(d.value) / Math.PI) * 18,
      })
      .append("i").attr({
        class: d => "icon fa fa-fw fa-" + d.platform.toLowerCase(),
      });
  });
};

// -- Running Code -- //
const pc = d3.select("#platformControl");

pc.append("button")
  .text("All")
  .attr({
    id: "platform-all"
  })
  .on("click", () => {
    pc.selectAll("button").classed({selected: false});
    parameters.platform = platforms;
    generateCharts(parameters);
    pc.select("#platform-all").classed({selected: true});
  });

pc.selectAll(".control")
  .data(platforms)
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

const cc = d3.select("#categoryControl");

cc.selectAll(".control")
  .data(Object.keys(groups))
  .enter()
  .append("button").classed({control: true})
  .attr({
    id: d => "category-" + d
  })
  .on("click", (d) => {
    cc.selectAll("button").classed({selected: false});
    parameters.category = groups[d];
    generateCharts(parameters);
    cc.select("#category-" + d).classed({selected: true})
  })
  .text(d => d)


generateCharts({
  platform: platforms,
  category: groups.Total,
});
pc.select("#platform-All").classed({selected: true})
cc.select("#category-Total").classed({selected: true})
