export function tableStyle() {
  const style = {
    bg: '#f9fafb',
    color: '#333333',
    primary: '#5971f7',
    border: '#fff',
  }
  return {
    main: {
      header: () => {
        return {
          backgroundColor: style.bg,
          color: style.color,
          fontWeight: 400,
          borderBottom:'1px solid #eaeaea'
        }
      },
      row: () => {
        return {
          color: style.color,
          fontSize: '12px',
        }
      },
      tableRowClassName: ({ row, rowIndex }) => {
        if (rowIndex % 2 !== 0) {
          // return 'odd-row-bg'
        }
      },
      tableColClassName: ({ row, column }) => {
        if (column.property === 'name') {
          return 'heigh-light'
        }
      },
    },
  }
}
