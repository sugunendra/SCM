#pip install matplotlib
#pip install streamlit pandas numpy matplotlib



import streamlit as st
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt

# ---- Title ----
st.title("📦 Bullwhip Effect Simulation")
st.write("Simulate how demand fluctuations amplify across the supply chain.")

# ---- Sidebar: User Inputs ----
st.sidebar.header("Simulation Settings")

# Demand Volatility: How much demand fluctuates
demand_volatility = st.sidebar.slider("Customer Demand Volatility (%)", 0, 100, 20)

# Lead Time: Delay in order fulfillment
lead_time = st.sidebar.slider("Lead Time (weeks)", 1, 6, 2)

# Number of periods to simulate
num_weeks = st.sidebar.slider("Simulation Duration (weeks)", 10, 52, 30)

# ---- Generate Demand Data ----
np.random.seed(42)
base_demand = 100
demand_shocks = np.random.randint(-demand_volatility, demand_volatility, num_weeks)
customer_demand = base_demand + demand_shocks

# ---- Simulating Supply Chain Reactions ----
def simulate_supply_chain(demand, lead_time):
    retailer_orders = np.zeros(num_weeks)
    wholesaler_orders = np.zeros(num_weeks)
    distributor_orders = np.zeros(num_weeks)
    manufacturer_orders = np.zeros(num_weeks)

    for t in range(1, num_weeks):
        retailer_orders[t] = demand[t] + np.random.randint(-5, 5)  # Small fluctuations
        wholesaler_orders[t] = retailer_orders[t-lead_time] if t >= lead_time else 100
        distributor_orders[t] = wholesaler_orders[t-lead_time] if t >= lead_time else 100
        manufacturer_orders[t] = distributor_orders[t-lead_time] if t >= lead_time else 100

    return retailer_orders, wholesaler_orders, distributor_orders, manufacturer_orders

retailer_orders, wholesaler_orders, distributor_orders, manufacturer_orders = simulate_supply_chain(customer_demand, lead_time)

# ---- Plot Results ----
fig, ax = plt.subplots(figsize=(10, 5))
ax.plot(customer_demand, label="Customer Demand", linestyle="dashed", color="blue")
ax.plot(retailer_orders, label="Retailer Orders", color="red")
ax.plot(wholesaler_orders, label="Wholesaler Orders", color="green")
ax.plot(distributor_orders, label="Distributor Orders", color="purple")
ax.plot(manufacturer_orders, label="Manufacturer Orders", color="orange")

ax.set_xlabel("Weeks")
ax.set_ylabel("Order Quantity")
ax.set_title("Bullwhip Effect Simulation")
ax.legend()
ax.grid(True)

st.pyplot(fig)

# ---- Conclusion ----
st.write("🔍 Notice how the demand variability increases as we move upstream in the supply chain. This is the **Bullwhip Effect!**")