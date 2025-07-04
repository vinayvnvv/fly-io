"use client";

import {
  Box,
  Card,
  FormControlLabel,
  FormGroup,
  Slider,
  Stack,
  Switch,
  Typography,
} from "@mui/material";
import { Chart } from "./Chart";
import { formatTime } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Header } from "../AppBar";
import ValueLabelComponent from "../ValueLabelComponent";
import { AirbnbSlider } from "../AirbnbSlider";

// Constants
const startTime = 9 * 60 + 15; // 9:15 AM
const endTime = 15 * 60 + 30; // 3:30 PM
const totalMinutes = endTime - startTime;
const defaultRange = [0, totalMinutes];
function getCurrentMinutesFromStart() {
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  if (currentMinutes >= startTime && currentMinutes <= endTime) {
    return currentMinutes - startTime;
  }
  return null;
}
const OpenInterest = () => {
  const [timeRangeValue, setTimeRangeValue] = useState([0, 375]);
  const [timeRange, setTimeRange] = useState([0, 375]);
  const [OIChange, setOIChange] = useState(false);
  const handleRangeChange = (event, newValue) => {
    setTimeRange(newValue);
  };
  useEffect(() => {
    const interval = setInterval(() => {
      const current = getCurrentMinutesFromStart();
      if (current !== null) {
        // Set slider from 9:15 to current time
        setTimeRange([0, current]);
        setTimeRangeValue([0, current]);
      } else {
        // Outside trading hours, reset to default
        setTimeRange(defaultRange);
        setTimeRangeValue([0, current]);
      }
    }, 3 * 60 * 1000); // update every minute

    // Initial run immediately
    const current = getCurrentMinutesFromStart();
    if (current !== null) {
      setTimeRange([0, current]);
      setTimeRangeValue([0, current]);
    }

    return () => clearInterval(interval);
  }, []);
  return (
    <>
      <Header>
        <Box sx={{ p: 2 }}>
          <Stack direction={"row"} spacing={2}>
            <Stack flexGrow={1} direction={"row"} gap={3} alignItems={"center"}>
              <Stack
                flexGrow={1}
                direction={"row"}
                gap={4}
                alignItems={"center"}
              >
                <Typography variant="subtitle2">9:15</Typography>
                <Slider
                  color="white"
                  value={timeRangeValue}
                  onChange={(_, v) => setTimeRangeValue(v)}
                  onChangeCommitted={handleRangeChange}
                  valueLabelDisplay="on"
                  min={0}
                  slots={{
                    valueLabel: ValueLabelComponent,
                  }}
                  max={totalMinutes}
                  valueLabelFormat={formatTime}
                />
                <Typography variant="subtitle2">3:30</Typography>
              </Stack>
              <Box></Box>
            </Stack>
            <Stack>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Switch
                      color="white"
                      defaultChecked
                      checked={OIChange}
                      onChange={(e) => setOIChange(e.target.checked)}
                    />
                  }
                  label="IO Change"
                />
              </FormGroup>
            </Stack>
          </Stack>
        </Box>
      </Header>
      <Stack direction={"row"} gap={2}>
        {/* <Card variant="outlined">Filters</Card> */}
        <Box flexGrow={1}>
          <Stack gap={2}>
            <Stack gap={1} direction={"row"}>
              <Card variant="outlined" sx={{ flexGrow: 1, minWidth: "50%" }}>
                <Chart
                  OIChange={OIChange}
                  timeRange={timeRange}
                  symbol={"NIFTY"}
                />
              </Card>
              <Card variant="outlined" sx={{ flexGrow: 1, minWidth: "50%" }}>
                <Chart
                  OIChange={OIChange}
                  timeRange={timeRange}
                  symbol={"BANKNIFTY"}
                />
              </Card>
            </Stack>
            <Stack gap={1} direction={"row"}>
              <Card
                variant="outlined"
                sx={{ flexGrow: 1, minWidth: "50%", maxWidth: "50%" }}
              >
                <Chart
                  timeRange={timeRange}
                  symbol={"SENSEX"}
                  OIChange={OIChange}
                />
              </Card>
              <Card
                variant="outlined"
                sx={{ flexGrow: 1, minWidth: "50%", maxWidth: "50%" }}
              >
                <Chart
                  timeRange={timeRange}
                  symbol={"FINNIFTY"}
                  OIChange={OIChange}
                />
              </Card>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </>
  );
};

export { OpenInterest };
