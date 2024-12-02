import React from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import "./EmotionGraph.css";

const EmotionGraph = () => {
    // 예제 데이터
    const data = [
        { date: "11-01", emotion: 3 },
        { date: "11-02", emotion: 5 },
        { date: "11-03", emotion: 2 },
        { date: "11-04", emotion: 4 },
        { date: "11-05", emotion: 3 },
        { date: "11-06", emotion: 1 },
        { date: "11-07", emotion: 5 },
    ];

    return (
        <div className="graph-popup">
            <h2 className="graph-title">장기적 감정 그래프</h2>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data}>
                    <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="emotion" stroke="#8884d8" strokeWidth={2} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default EmotionGraph;
