import React from "react";

import Tooltip from "@mui/material/Tooltip";

import { styled } from "@mui/material/styles";
import { SliderThumb } from "@mui/material";

// 1. Create a custom styled component for the ValueLabel
// This allows us to adjust the vertical position of the value label.
// By default, the value label is positioned above the thumb.
// To move it below, we can adjust its 'top' property.
const CustomValueLabel = styled("span")(({ theme }) => ({
  // Position it relative to the slider thumb.
  // The default `ValueLabelComponent` positions itself using `transform`.
  // We need to counteract that and move it downwards.
  //   position: "absolute",
  //   top: "calc(100% + 8px)", // Adjust this value to move the tooltip further down if needed
  //   left: "50%", // Keep it centered horizontally relative to the thumb
  //   transform: "translateX(-50%)", // Adjust for horizontal centering
  // You might need more fine-tuning based on your specific theme and desired look.
  // We'll let the Tooltip itself handle its own styling for the bubble.
}));

// 2. Create the custom ValueLabelComponent that uses a Tooltip
// This component will be passed to the Slider's `slots.valueLabel` prop (or `ValueLabelComponent` prop for older MUI versions)
function ValueLabelComponent(props) {
  const { children, value } = props;

  // The Tooltip component handles the actual tooltip bubble.
  // We set its `placement` to 'bottom'.
  // We also make it `open` when `children` is present (meaning the slider thumb is active)
  return (
    <Tooltip
      open={true} // Always open when this component is rendered by the slider
      enterTouchDelay={0}
      placement="bottom" // <<< Key: Set placement to 'bottom'
      title={value} // The value to display in the tooltip
      arrow // Optional: add an arrow to the tooltip
      // Optional: Add custom styles to the Tooltip's Popper or tooltip itself if needed

      {...props}
    />
  );
}

function AirbnbThumbComponent(props) {
  const { children, ...other } = props;
  return (
    <SliderThumb {...other}>
      {children}
      <span className="airbnb-bar" />
      <span className="airbnb-bar" />
      <span className="airbnb-bar" />
    </SliderThumb>
  );
}

export default ValueLabelComponent;
export { AirbnbThumbComponent };
