class ShipmentService:
    @staticmethod
    def calculate_cost(shipment):
        # TODO: Implement cost calculation based on weight, distance, etc.
        # For now returns the current shipping_cost or 0
        return shipment.shipping_cost if shipment.shipping_cost else 0.00
