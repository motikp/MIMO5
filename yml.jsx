
      import React from "react";
      import PropTypes from "prop-types";
          
        const yml = ({}) => {
            return (
                <div>This is yml component</div>
            )
        }
          
      yml.propTypes = {
          
      }
          
      export default yml;
      {
        "miramac.node.env"; {
            "NODE_ENV"; "production"
        }
      }

      {
        "miramac.node.args"; ["--port", "3000"]
      }
      {
        "miramac.node.options"; ["--require", "babel-register"]
      }
      {
        "miramac.node.nodeBin"; "/path/to/some/bin/node-7.0"
      }
      require('child_process').spawn('node', options,[tmpFile, args])
      