import { useEffect, useState } from "react";
import { Button, Input, Popconfirm, message } from "antd";
import { brandApi } from "../../api/brand.api";
import PageHeader from "../../components/PageHeader";
import WmsTable from "../../components/Wmstable";
import { useNavigate } from "react-router-dom";
import type { BrandDto } from "../../types/brand";

export default function BrandList() {
    const [data, setData] = useState<BrandDto[]>([]);
    const [search, setSearch] = useState("");
    const navigate = useNavigate();

    const load = async () => {
        const res = await brandApi.getAll();
        setData(res.data);
    };

    useEffect(() => { load(); }, []);

    const filtered = data.filter(x =>
        x.name.toLowerCase().includes(search.toLowerCase()) ||
        (x.code ?? "").toLowerCase().includes(search.toLowerCase())
    );

    return (
        <>
            <PageHeader
                title="Brands"
                button={
                    <Button type="primary" onClick={() => navigate("/master/brands/create")}>
                        Create Brand
                    </Button>
                }
            />

            <Input.Search
                placeholder="Search by name or code..."
                style={{ width: 300, marginBottom: 16 }}
                onChange={e => setSearch(e.target.value)}
            />

            <WmsTable
                dataSource={filtered}
                rowKey="id"
                columns={[
                    { title: "ID", dataIndex: "id", width: 80 },
                    { title: "Code", dataIndex: "code", width: 120 },
                    { title: "Name", dataIndex: "name" },
                    { title: "Description", dataIndex: "description" },
                    {
                        title: "Active",
                        dataIndex: "isActive",
                        width: 100,
                        render: (val: boolean) => (val ? "Yes" : "No")
                    },
                    {
                        title: "Actions",
                        width: 150,
                        render: (record: BrandDto) => (
                            <>
                                <Button
                                    type="link"
                                    onClick={() => navigate(`/master/brands/edit/${record.id}`)}
                                >
                                    Edit
                                </Button>

                                <Popconfirm
                                    title="Delete this brand?"
                                    onConfirm={async () => {
                                        await brandApi.delete(record.id);
                                        message.success("Deleted");
                                        load();
                                    }}
                                >
                                    <Button danger type="link">Delete</Button>
                                </Popconfirm>
                            </>
                        ),
                    },
                ]}
            />
        </>
    );
}
