using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CellPhone.Migrations
{
    /// <inheritdoc />
    public partial class columnPriceOrder : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<decimal>(
                name: "PriceOrder",
                table: "orderDetails",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PriceOrder",
                table: "orderDetails");
        }
    }
}
