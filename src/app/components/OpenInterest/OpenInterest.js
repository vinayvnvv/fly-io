"use client";

import { Box, Card, Slider, Stack, Typography } from "@mui/material";
import { Chart } from "./Chart";
import { formatTime } from "@/lib/utils";
import { useEffect, useState } from "react";

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
  const handleRangeChange = (event, newValue) => {
    setTimeRange(newValue);
  };
  useEffect(() => {
    const interval = setInterval(() => {
      const current = getCurrentMinutesFromStart();
      if (current !== null) {
        // Set slider from 9:15 to current time
        setTimeRange([0, current]);
      } else {
        // Outside trading hours, reset to default
        setTimeRange(defaultRange);
      }
    }, 60 * 1000); // update every minute

    // Initial run immediately
    const current = getCurrentMinutesFromStart();
    if (current !== null) {
      setTimeRange([0, current]);
    }

    return () => clearInterval(interval);
  }, []);
  return (
    <Stack direction={"row"} gap={2}>
      {/* <Card variant="outlined">Filters</Card> */}
      <Box flexGrow={1}>
        <Stack gap={2}>
          <Box sx={{ p: 2 }}>
            <Stack direction={"row"} gap={3} alignItems={"center"}>
              <Stack
                flexGrow={1}
                direction={"row"}
                gap={4}
                alignItems={"center"}
              >
                <Typography variant="subtitle2">9:15</Typography>
                <Slider
                  value={timeRangeValue}
                  onChange={(_, v) => setTimeRangeValue(v)}
                  onChangeCommitted={handleRangeChange}
                  valueLabelDisplay="auto"
                  min={0}
                  max={totalMinutes}
                  valueLabelFormat={formatTime}
                />
                <Typography variant="subtitle2">3:30</Typography>
              </Stack>
              <Box></Box>
            </Stack>
          </Box>

          <Stack gap={3}>
            <Card variant="outlined">
              <Chart timeRange={timeRange} symbol={"NIFTY"} />
            </Card>
            <Card variant="outlined">
              <Chart timeRange={timeRange} symbol={"BANKNIFTY"} />
            </Card>
          </Stack>
        </Stack>
      </Box>
    </Stack>
  );
};

export { OpenInterest };
