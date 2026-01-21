import AppIcon from "../Component/AppIcon";
import DataGrid from "../Library/Table/DataGrid";
import CustomDataGrid from "../Library/Table/GenericTable";
import { tableColumns, tableData, agGridColumns } from "../Data/TableData";
import { useMemo } from "react";
const ActionComponent = ({ row }) => {
  return (
    <div className="flex items-center gap-2">
      {/* Edit */}
      <button
        type="button"
        title="Edit"
        className="
          p-1.5 rounded-md
          text-gray-600
          hover:text-emerald-600
          hover:bg-emerald-50
          transition
        "
        onClick={() => console.log("Edit", row)}
      >
        <AppIcon name="Pencil" size={16} />
      </button>

      {/* Delete */}
      <button
        type="button"
        title="Delete"
        className="
          p-1.5 rounded-md
          text-gray-600
          hover:text-red-600
          hover:bg-red-50
          transition
        "
        onClick={() => console.log("Delete", row)}
      >
        <AppIcon name="Trash2" size={16} />
      </button>
    </div>
  );
};


const columns = [
  {
    header: "Participant",
    children: [
      { label: "Name", key: "participant.name", sticky: "left" },
      { label: "Language", key: "participant.language" },
      { label: "Country", key: "participant.country" },
      // ...
    ],
  },
  {
    header: "Game",
    children: [
      { label: "Game Name", key: "game.name" },
      {
        label: "Bought",
        key: "game.bought",
        render: (v) => <input type="checkbox" checked={v} readOnly />,
      },
    ],
  },
  {
    header: "Performance",
    children: [
      { label: "Balance", key: "performance.balance" },
      {
        label: "Rating",
        key: "performance.rating",
        render: (v) => "★".repeat(v),
      },
    ],
  },
  {
    header: "",          // ✅ IMPORTANT
    children: [
      {
        label: "Actions",
        key: "__actions__",
        sticky: "right",
        width: 140,
        isAction: true,
        render: (row) => <ActionComponent row={row} />,
      },
    ],
  },
];

const data = [
  {
    participant: { name: "Tony Smith", language: "English", country: "Ireland" },
    game: { name: "Chess", bought: true },
    performance: { balance: "$2,397", rating: 2 },
  },
  {
    participant: { name: "Andrew Connell", language: "Swedish", country: "Sweden" },
    game: { name: "Bul", bought: true },
    performance: { balance: "$12,749", rating: 3 },
  },
  {
    participant: { name: "Maria Lopez", language: "Spanish", country: "Spain" },
    game: { name: "Sudoku", bought: false },
    performance: { balance: "$5,120", rating: 4 },
  },
  {
    participant: { name: "Liam O'Brien", language: "English", country: "Australia" },
    game: { name: "Poker", bought: true },
    performance: { balance: "$8,450", rating: 5 },
  },
  {
    participant: { name: "Noah Fischer", language: "German", country: "Germany" },
    game: { name: "Checkers", bought: false },
    performance: { balance: "$1,980", rating: 1 },
  },
  {
    participant: { name: "Aiko Tanaka", language: "Japanese", country: "Japan" },
    game: { name: "Go", bought: true },
    performance: { balance: "$15,600", rating: 5 },
  },
  {
    participant: { name: "Pierre Martin", language: "French", country: "France" },
    game: { name: "Scrabble", bought: false },
    performance: { balance: "$3,720", rating: 3 },
  },
  {
    participant: { name: "Ivan Petrov", language: "Russian", country: "Russia" },
    game: { name: "Dominoes", bought: true },
    performance: { balance: "$6,330", rating: 4 },
  },
  {
    participant: { name: "Chen Wei", language: "Mandarin", country: "China" },
    game: { name: "Mahjong", bought: true },
    performance: { balance: "$9,210", rating: 5 },
  },
  {
    participant: { name: "Sara Nilsson", language: "Swedish", country: "Norway" },
    game: { name: "Backgammon", bought: false },
    performance: { balance: "$4,150", rating: 2 },
  },
  {
    participant: { name: "Carlos Mendes", language: "Portuguese", country: "Brazil" },
    game: { name: "Ludo", bought: true },
    performance: { balance: "$7,980", rating: 3 },
  },
  {
    participant: { name: "Emma Wilson", language: "English", country: "Canada" },
    game: { name: "Monopoly", bought: true },
    performance: { balance: "$11,430", rating: 4 },
  },
  {
    participant: { name: "Ahmed Hassan", language: "Arabic", country: "Egypt" },
    game: { name: "Carrom", bought: false },
    performance: { balance: "$2,860", rating: 2 },
  },
  {
    participant: { name: "Ravi Patel", language: "Gujarati", country: "India" },
    game: { name: "Cricket Manager", bought: true },
    performance: { balance: "$13,700", rating: 5 },
  },
  {
    participant: { name: "Sunita Sharma", language: "Hindi", country: "India" },
    game: { name: "Word Puzzle", bought: false },
    performance: { balance: "$1,540", rating: 1 },
  },
  {
    participant: { name: "Lucas Romano", language: "Italian", country: "Italy" },
    game: { name: "Tetris", bought: true },
    performance: { balance: "$10,120", rating: 4 },
  },
  {
    participant: { name: "Sofia Petrova", language: "Bulgarian", country: "Bulgaria" },
    game: { name: "Crossword", bought: false },
    performance: { balance: "$2,330", rating: 2 },
  },
  {
    participant: { name: "Daniel Kim", language: "Korean", country: "South Korea" },
    game: { name: "StarCraft", bought: true },
    performance: { balance: "$18,450", rating: 5 },
  },
  {
    participant: { name: "Olivia Brown", language: "English", country: "USA" },
    game: { name: "Trivia Quiz", bought: false },
    performance: { balance: "$6,710", rating: 3 },
  },
  {
    participant: { name: "Mateo Alvarez", language: "Spanish", country: "Mexico" },
    game: { name: "Candy Crush", bought: true },
    performance: { balance: "$9,980", rating: 4 },
  },

  // 30 more records (same uniqueness pattern)
  ...Array.from({ length: 30 }, (_, i) => ({
    participant: {
      name: `Player ${i + 21}`,
      language: `Language ${i + 1}`,
      country: `Country ${i + 1}`,
    },
    game: {
      name: `Game ${i + 1}`,
      bought: i % 2 === 0,
    },
    performance: {
      balance: `$${(i + 21) * 1_137}`,
      rating: (i % 5) + 1,
    },
  })),
];



const Home = () => {
  return (

    <>
      <DataGrid
        rowData={tableData}
        columnDefs={agGridColumns}
        height={520}
        enableRowSelection="multiple"
        enableSorting={true}
        enableFilter={true}
        enableColResize={true}
        pagination={true}
        paginationPageSize={10}
        paginationPageSizeSelector={[10, 25, 50, 100]}
        onSelectionChanged={(event) => console.log('Selection changed:', event.api.getSelectedRows())}
        onCellClicked={(event) => console.log('Cell clicked:', event)}
        onGridReady={(params) => console.log('Grid ready:', params)}
        defaultColDef={{
          sortable: true,
          filter: true,
          resizable: true,
          minWidth: 100,
          flex: 1,
        }}
        gridOptions={{
          animateRows: true,
          enableStatusBar: true,
          enableCellTextSelection: true,
          enableBrowserTooltips: true,
        }}
      />

      <div>
        Home

      </div>
      <CustomDataGrid
        title="Participants"
        columns={columns}
        data={data}
        showIndex={true}
      />
    </>
  );
}

export default Home