import { http } from "@/lib/http";
import { findNearest, getISOTime, roundToNearest50 } from "@/lib/utils";
import {
  Box,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Slider,
  Stack,
  Typography,
} from "@mui/material";
import {
  BarChart,
  BarPlot,
  ChartContainer,
  ChartsAxisHighlight,
  ChartsAxisTooltipContent,
  ChartsGrid,
  ChartsItemTooltipContent,
  ChartsReferenceLine,
  ChartsTooltip,
  ChartsTooltipContainer,
  ChartsXAxis,
  ChartsYAxis,
  LinePlot,
  MarkPlot,
} from "@mui/x-charts";
import { useEffect, useState } from "react";

const Chart = ({ symbol, filters, timeRange, OIChange = true }) => {
  const [data, setData] = useState();
  const [OIData, setIOData] = useState();
  const [expiries, setExpires] = useState({});
  const [chartData, setChartData] = useState({ xAxis: [], series: [] });
  const getOIData = (restData) => {
    const body = {
      underlying: symbol,
      mode: "intraday",
      expiries,
      atm_strike_selection: "ten",
      input_min_strike: null,
      input_max_strike: null,
      from_time: "2025-05-21T03:45:00Z",
      //   to_time: "2025-05-21T08:52:00Z",
      auto_update: "disabled",
      from_date: null,
      to_date: null,
      show_oi: true,
      ...restData,
    };

    http.post("/api/oi-change", body).then((_res) => {
      console.log(_res);
      const res = _res.data;
      if (res && res.success && res.payload) {
        setData(res.payload);
      }
    });
  };

  const getOIMainData = (callback) => {
    http
      .post("/api/oi", {
        symbol,
      })
      .then((res) => {
        const { data } = res;
        if (data && data.success) {
          setIOData(data.payload);
          setExpires(data.payload.expiries);
          callback();
        }
      });
  };

  useEffect(() => {
    getOIMainData(() => {
      getOIData();
    });
  }, []);

  useEffect(() => {
    createChartData();
  }, [OIChange]);

  const createChartData = () => {
    const { per_strike_data } = data || {};
    if (per_strike_data) {
      const keys = Object.keys(per_strike_data);
      const xAxis = [
        { data: [], scaleType: "band", id: "x-axis-id", height: 50 },
      ];
      if (OIChange) {
        const series = [{ data: [] }, { data: [] }, { data: [] }, { data: [] }];
        keys.forEach((key, idx) => {
          const _d = per_strike_data[key];
          xAxis[0].data.push(key);
          series[0].data.push(_d.from_call_oi);
          series[1].data.push(_d.to_call_oi - _d.from_call_oi);
          series[2].data.push(_d.from_put_oi);
          series[3].data.push(_d.to_put_oi - _d.from_put_oi);
        });
        setChartData({ xAxis, series });
      } else {
        const series = [{ data: [] }, { data: [] }];
        keys.forEach((key, idx) => {
          const _d = per_strike_data[key];
          xAxis[0].data.push(key);
          series[0].data.push(_d.to_call_oi);
          series[1].data.push(_d.to_put_oi);
        });
        setChartData({ xAxis, series });
      }
    }
  };

  useEffect(() => {
    createChartData();
  }, [data]);

  useEffect(() => {
    const restData = {};
    if (timeRange) {
      const [startISO, endISO] = timeRange.map(getISOTime);
      if (startISO) restData.from_time = startISO;
      if (endISO) {
        restData.to_time = endISO;
      }
    }
    getOIData(restData);
  }, [timeRange, expiries]);

  console.log(expiries);

  const onExpiryChange = (checked, key) => {
    setExpires({
      ...expiries,
      [key]: {
        ...expiries[key],
        is_enabled: checked,
      },
    });
  };

  return (
    <Box>
      <Stack
        p={2}
        direction={"row"}
        alignItems={"center"}
        gap={4}
        justifyContent={"space-between"}
      >
        <Typography>{symbol}</Typography>
        <Stack>
          <FormGroup row>
            {Object.keys(expiries).map((key) => (
              <FormControlLabel
                key={key}
                control={
                  <Checkbox
                    checked={expiries[key].is_enabled}
                    onChange={(e) => onExpiryChange(e.target.checked, key)}
                  />
                }
                label={key}
              />
            ))}
          </FormGroup>
        </Stack>
      </Stack>
      {data && chartData.xAxis && chartData.xAxis[0] && (
        <ChartContainer
          // colors={["#d86c6c", "#47ca47"]}
          xAxis={chartData.xAxis}
          sx={{
            ["& .MuiBarElement-series-put-oi-slanted-lines"]: {
              fill: "url(#put-oi-slanted-lines)",
            },
            ["& .MuiBarElement-series-call-oi-slanted-lines"]: {
              fill: "url(#call-oi-slanted-lines)",
            },
          }}
          series={
            !OIChange
              ? [
                  {
                    type: "bar",
                    data: chartData?.series?.[1]?.data || [],
                    color: "#47ca47",
                  },
                  {
                    type: "bar",
                    data: chartData?.series?.[0]?.data || [],
                    color: "#d86c6c",
                  },
                ]
              : [
                  {
                    type: "bar",
                    data: chartData?.series?.[2]?.data || [],
                    color: "#47ca47",
                    stack: "put",
                  },
                  {
                    type: "bar",
                    data: chartData?.series?.[3]?.data || [],
                    color: "#47fa40",
                    stack: "put",
                    id: "call-oi-slanted-lines",
                  },

                  {
                    type: "bar",
                    data: chartData?.series?.[0]?.data || [],
                    color: "#d86c0c",
                    stack: "call",
                  },
                  {
                    type: "bar",
                    data: chartData?.series?.[1]?.data || [],
                    color: "#d86c6a",
                    stack: "call",
                    id: "put-oi-slanted-lines",
                  },
                ]
          }
          yAxis={[
            {
              valueFormatter: (value) =>
                `${(value / 100000).toLocaleString()}k`,
              label: "Call / Put OI",
              // width: fixMargin ? 85 : undefined,
            },
          ]}
          height={500}
        >
          <BarPlot borderRadius={3} />
          <ChartsGrid horizontal />
          <ChartsReferenceLine
            x={`${findNearest(chartData.xAxis[0].data, data.to_ltp)}`}
            labelStyle={{ fontSize: "10", lineHeight: 1.2 }}
            label={`${symbol}\n${data.to_ltp}`}
            labelAlign="start"
          />
          <ChartsXAxis axisId="x-axis-id" />
          <ChartsYAxis />
          <ChartsTooltipContainer>
            <ChartsTooltip trigger="axis" />
            <ChartsAxisTooltipContent />
            <ChartsItemTooltipContent />
          </ChartsTooltipContainer>
          <ChartsAxisHighlight x="band" y="line" />
          <pattern
            id="call-oi-slanted-lines"
            width="16"
            height="16"
            patternUnits="userSpaceOnUse"
          >
            <rect
              class="visx-pattern-line-background"
              width="16"
              height="16"
              fill="#a0e7a0"
            ></rect>
            <path
              class="visx-pattern-line"
              d="M 0,16 l 16,-16 M -4,4 l 8,-8
             M 12,20 l 8,-8"
              stroke="#40ac40"
              stroke-width="4"
              stroke-linecap="square"
              shape-rendering="auto"
            ></path>
          </pattern>
          <defs>
            <pattern
              id="put-oi-slanted-lines"
              width="16"
              height="16"
              patternUnits="userSpaceOnUse"
            >
              <rect
                class="visx-pattern-line-background"
                width="16"
                height="16"
                fill="#e2afaf"
              ></rect>
              <path
                class="visx-pattern-line"
                d="M 0,0 l 16,16
        M -4,12 l 8,8
        M 12,-4 l 8,8"
                stroke="rgb(216, 108, 106)"
                stroke-width="4"
                stroke-linecap="round"
                shape-rendering="auto"
              ></path>
            </pattern>
          </defs>
        </ChartContainer>
      )}
    </Box>
  );
};

export { Chart };
