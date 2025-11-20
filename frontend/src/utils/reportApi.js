import axios from "axios";
import { useState, useEffect } from 'react';

const API_URL = process.env.NODE_ENV === 'production' 
  ? 'https://api.touiteur.be:3000' // Production API address
  : 'http://localhost:3007/api'; // Local API address for testing

export async function getAllReportReasons() {
  try {
    const res = await axios.get(`${API_URL}/reports/reason`, {
      withCredentials: true
    });
    return res.data;
  } catch (error) {
    throw error;
  }
}

export async function getAllReportStatus() {
  try {
    const res = await axios.get(`${API_URL}/reports/status`, {
      withCredentials: true
    });
    return res.data;
  } catch (error) {
    throw error;
  }
}

export async function getAllReports() {
  try {
    const res = await axios.get(`${API_URL}/reports`, {
      withCredentials: true
    });
    return res.data;
  } catch (error) {
    throw error;
  }
}

export async function getReportById(reportId) {
  try {
    const res = await axios.get(`${API_URL}/reports/${reportId}`, {
      withCredentials: true 
    });
    return res.data;
  } catch (error) {
    throw error;
  }
}

export async function createReport({ touiteId, posterId, requesterId, comment, reason }) {
  try {
    const res = await axios.post(`${API_URL}/reports`, {
      touiteId,
      posterId,
      requesterId,
      comment,
      reason
    }, {
      withCredentials: true
    });
    return res.data;
  } catch (error) {
    throw error;
  }
}

export async function updateReportStatus(reportId, status, moderator) {
  try {
    const res = await axios.put(`${API_URL}/reports/${reportId}/status`, {
      status,
      moderator
    }, {
      withCredentials: true 
    });
    return res.data;
  } catch (error) {
    throw error;
  }
}
