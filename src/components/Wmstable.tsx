import { Table } from "antd";

export default function WmsTable(props: any) {
    return (
        <Table
            {...props}
            bordered
            size="middle"
            pagination={{ pageSize: 8 }}
            style={{ background: "white", borderRadius: 10 }}
        />
    );
}
