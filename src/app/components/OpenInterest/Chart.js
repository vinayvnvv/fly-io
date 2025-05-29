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

const Chart = ({ symbol, filters, timeRange }) => {
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
    const createChartData = () => {
      const { per_strike_data } = data || {};
      if (per_strike_data) {
        const keys = Object.keys(per_strike_data);
        const xAxis = [
          { data: [], scaleType: "band", id: "x-axis-id", height: 50 },
        ];
        const series = [{ data: [] }, { data: [] }];
        keys.forEach((key, idx) => {
          const _d = per_strike_data[key];
          xAxis[0].data.push(key);
          series[0].data.push(_d.to_call_oi);
          series[1].data.push(_d.to_put_oi);
        });
        setChartData({ xAxis, series });
      }
    };
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
          series={[
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
          ]}
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
          <BarPlot borderRadius={2} />
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
        </ChartContainer>
      )}
    </Box>
  );
};

export { Chart };
