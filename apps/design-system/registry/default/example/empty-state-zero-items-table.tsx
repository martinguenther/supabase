import { Card, Table, TableBody, TableHead, TableHeader, TableRow, TableCell } from 'ui'

export default function EmptyStateZeroItemsTable() {
  return (
    <Card className="w-full">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-foreground-muted">Table name</TableHead>
            <TableHead className="text-foreground-muted">Date created</TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow className="[&>td]:hover:bg-inherit">
            <TableCell colSpan={3}>
              <p className="text-sm text-foreground">No tables yet</p>
              <p className="text-sm text-foreground-lighter">Connect a table from your database</p>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Card>
  )
}
