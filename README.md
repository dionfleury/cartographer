# Cartographer

A user-friendly application for creating SLD (Styled Layer Descriptor) styling documents for geospatial data. This tool simplifies the process of designing map styles using an intuitive graphical interface.

This project borrows the general idea of interactive geospatial styling from [GeoStyler](https://geostyler.org/) but takes a unique approach as part of a personal learning exercise.

While Cartographer is still in development and not yet a fully polished product, it already serves as an effective tool for accelerating the process of creating simple SLD styles.

## Features

- **Interactive Styling Panel**: Easily define and preview your styles through a responsive UI.
- **Dynamic Rule Configuration**: Customize rules and properties such as colors, line weights, and fill patterns.
- **SLD Generation**: Export your styles as valid SLD XML documents.
- **Data Integration**: Load geospatial data from WFS to preview styles in real-time.
- **Customizable Inputs**: Includes color pickers, dropdowns, and text inputs for flexible style definition.
- **Client-Side Processing**: All operations are handled locally in the browser, ensuring that no data is written to a server. This design makes the application safe to use, even with confidential datasets.


## Usage  

1. **Load Data**:  
   Use the form on the left side of the application to load geospatial data from a WFS (Web Feature Service). 
   
   ***(Currently, WFS input is assumed to be a valid service returning a GetCapabilities XML document. Invalid URLs or query parameters may crash the application. If that happens just reload the page.)***

2. **Automatic Style Generation**:  
   Once the data is loaded, a default style is automatically generated based on the geometry type of the data (point, line, or polygon).  

3. **Map Interaction**:  
   - Click on any object in the map view to open the **Feature Info Panel**.  
   - The schema view is fully implemented and displays all attributes for the selected feature type.  

4. **Export Formats**:  
   The application currently supports the automatic generation of both:  
   - **SLD v1.0 documents**  
   - **JSLD (Javascript Styled Layer Descriptor)** as an intermediate format  (this is not a standardized format)

By following these steps, you can quickly style your geospatial data and export it for use in mapping applications.

### Not yet implemented features

There are a couple buttons and panels that currently serve as placeholders.


## Technologies Used

- **React** for building the user interface.
- **Mantine** components for a modern, responsive design.
- **OpenLayers** for data visualization and real-time style updates.
- **Monaco Editor** for code editing and highligting.

