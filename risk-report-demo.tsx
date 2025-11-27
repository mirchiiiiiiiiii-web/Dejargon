import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, ChevronDown, ChevronUp, Copy, FileText, Download } from 'lucide-react';

const RiskReportPage = ({ riskScore, summaryText, issues, clauses }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [expandedIssues, setExpandedIssues] = useState({});
  const [currentPage, setCurrentPage] = useState(8);
  const totalPages = 12;

  const toggleIssue = (issueId) => {
    setExpandedIssues(prev => ({
      ...prev,
      [issueId]: !prev[issueId]
    }));
  };

  const getScoreColor = (score) => {
    if (score <= 40) return '#10b981';
    if (score <= 69) return '#f59e0b';
    return '#ef4444';
  };

  const getScoreLabel = (score) => {
    if (score <= 40) return 'Low Risk';
    if (score <= 69) return 'Moderately Risky';
    return 'High Risk';
  };

  const reviewStages = [
    { name: "Reviewed by AI", completed: true },
    { name: "Reviewed by Experts", completed: true },
    { name: "Reviewed by Advocates", completed: false }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="text-2xl font-bold text-gray-900">Dejargon</div>
          <div className="flex items-center gap-3">
            <button className="px-5 py-2 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-50 font-medium flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Upload New
            </button>
            <button className="px-5 py-2 bg-blue-900 text-white rounded-full hover:bg-blue-800 font-medium flex items-center gap-2">
              <Download className="w-4 h-4" />
              Download Report
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-12 gap-6">
          {/* Left Panel - Document Viewer */}
          <div className="col-span-5 bg-white rounded-xl shadow-sm border border-gray-200">
            {/* Review Progress */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between mb-6">
                {reviewStages.map((stage, index) => (
                  <div key={index} className="flex items-center">
                    <div className={`flex items-center gap-2 ${stage.completed ? 'text-blue-900' : 'text-gray-400'}`}>
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${stage.completed ? 'bg-blue-900' : 'bg-gray-200'}`}>
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                        </svg>
                      </div>
                      <span className="text-xs font-medium hidden md:block">{stage.name}</span>
                    </div>
                    {index < reviewStages.length - 1 && (
                      <div className={`w-16 h-1 mx-2 ${stage.completed ? 'bg-blue-900' : 'bg-gray-200'}`}></div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Document Content */}
            <div className="p-6 max-h-screen overflow-y-auto">
              <div className="space-y-6">
                {clauses.map((clause, index) => (
                  <div key={index} className="pb-4 border-b border-gray-100 last:border-0">
                    <h3 className="font-bold text-gray-900 mb-2">{clause.title}.</h3>
                    <p className="text-sm text-gray-700 leading-relaxed">{clause.text}</p>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-center gap-4 mt-8 pt-6 border-t border-gray-200">
                <button 
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-50"
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="w-5 h-5 text-gray-700" />
                </button>
                <span className="px-4 py-2 bg-gray-100 rounded-lg text-sm font-medium text-gray-900">
                  {currentPage}/{totalPages}
                </span>
                <button 
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-50"
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="w-5 h-5 text-gray-700" />
                </button>
              </div>
            </div>
          </div>

          {/* Right Panel - Analysis */}
          <div className="col-span-7">
            {/* Tabs */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-4">
              <div className="flex border-b border-gray-200">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`flex-1 px-6 py-4 font-medium ${
                    activeTab === 'overview' 
                      ? 'text-white bg-blue-900' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Analysis Overview
                </button>
                <button
                  onClick={() => setActiveTab('clauses')}
                  className={`flex-1 px-6 py-4 font-medium ${
                    activeTab === 'clauses' 
                      ? 'text-white bg-blue-900' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Clause Analysis
                </button>
                <button
                  onClick={() => setActiveTab('obligations')}
                  className={`flex-1 px-6 py-4 font-medium ${
                    activeTab === 'obligations' 
                      ? 'text-white bg-blue-900' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Obligations
                </button>
              </div>
            </div>

            {/* Score Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Score</h2>
              
              {/* Score Gauge */}
              <div className="flex items-center justify-center mb-6">
                <div className="relative w-64 h-32">
                  <svg viewBox="0 0 200 100" className="w-full h-full">
                    <path
                      d="M 20 80 A 80 80 0 0 1 180 80"
                      fill="none"
                      stroke="#e5e7eb"
                      strokeWidth="20"
                    />
                    <path
                      d="M 20 80 A 80 80 0 0 1 180 80"
                      fill="none"
                      stroke="url(#gradient)"
                      strokeWidth="20"
                      strokeDasharray="251"
                      strokeDashoffset={251 - (251 * riskScore / 100)}
                      strokeLinecap="round"
                    />
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#22c55e" />
                        <stop offset="50%" stopColor="#eab308" />
                        <stop offset="100%" stopColor="#ef4444" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-5xl font-bold" style={{ color: getScoreColor(riskScore) }}>{riskScore}</span>
                  </div>
                  <div className="absolute bottom-0 left-0 text-xs font-medium text-gray-600">0</div>
                  <div className="absolute bottom-0 right-0 text-xs font-medium text-gray-600">100</div>
                </div>
              </div>

              <div className="flex items-center justify-center mb-8">
                <span className="px-4 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-bold">
                  {getScoreLabel(riskScore)}
                </span>
              </div>

              {/* Summary */}
              <div className="mb-6">
                <h3 className="font-bold text-gray-900 mb-3">Summary</h3>
                <p className="text-sm text-gray-700 leading-relaxed mb-4">
                  {summaryText}
                </p>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 space-y-2">
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold">Key Highlights:</span>
                  </p>
                  <p className="text-sm text-gray-700">
                    • Payment Terms: 90-day cycle with interest on late payments.
                  </p>
                  <p className="text-sm text-gray-700 flex items-center gap-2">
                    • Termination: Either party can exit with only 1-day notice
                    <span className="px-2 py-0.5 bg-orange-100 text-orange-700 rounded text-xs font-medium flex items-center gap-1">
                      <Copy className="w-3 h-3" /> Unviable for long-term
                    </span>
                  </p>
                </div>
              </div>

              {/* Major Issues */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg">{issues.length}</span>
                  </div>
                  <h3 className="font-bold text-gray-900">Major Issues found</h3>
                </div>

                <div className="space-y-3">
                  {issues.map((issue, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                      <button
                        onClick={() => toggleIssue(index)}
                        className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
                      >
                        <span className="text-sm font-medium text-gray-900">
                          Issue {index + 1}: {issue.title}
                        </span>
                        {expandedIssues[index] ? (
                          <ChevronUp className="w-5 h-5 text-gray-500" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-500" />
                        )}
                      </button>
                      {expandedIssues[index] && (
                        <div className="px-4 pb-4 bg-gray-50">
                          <p className="text-sm text-gray-700 leading-relaxed">
                            {issue.description}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Demo with sample data
const App = () => {
  const demoData = {
    riskScore: 72,
    summaryText: "This service agreement contains several clauses that significantly favor the Service Provider. It defines payment timelines, service termination rights, liability exposure, confidentiality, governing law, dispute resolution, intellectual property ownership, and exceptions for force majeure events.",
    issues: [
      {
        title: "Termination Flexibility",
        description: "Either party can exit the contract with only a 1-day notice, regardless of project stage. This creates high instability, leaving the Service Provider exposed to sudden cancellations without recovery time or compensation."
      },
      {
        title: "Unlimited Liability",
        description: "The Service Provider is exposed to unlimited liability for all types of damages without any cap or limitation period."
      },
      {
        title: "Litigation-Only Dispute Resolution",
        description: "Requires all disputes to be resolved through costly litigation rather than arbitration or mediation alternatives."
      }
    ],
    clauses: [
      {
        title: "Payment Terms",
        text: "The Client shall pay the Service Provider within 90 (ninety) days from the date of receipt of an undisputed invoice. Any invoice not paid within such period shall accrue interest at the rate of 0.5% per month until fully paid. The Service Provider reserves the right to suspend or withhold further services in the event of non-payment."
      },
      {
        title: "Termination",
        text: "Either Party may terminate this Agreement at any time, with or without cause, upon providing one (1) day's written notice to the other Party. Upon termination, the Client shall promptly settle all outstanding payments, including for partially completed work."
      },
      {
        title: "Limitation of Liability",
        text: "The Service Provider shall be liable for all damages, losses, costs, and expenses of any nature, including but not limited to direct, indirect, incidental, special, consequential, and punitive damages, without limitation as to amount."
      },
      {
        title: "Confidentiality",
        text: "The Service Provider agrees not to disclose any confidential or proprietary information of the Client to any third party, except to its affiliates, contractors, or advisors who require such information in connection with the performance of services, without prior written consent from the Client."
      },
      {
        title: "Governing Law",
        text: "This Agreement shall be governed by and construed in accordance with the laws of the State of [Insert State], without giving effect to any conflict of law provisions that might otherwise apply."
      },
      {
        title: "Dispute Resolution",
        text: "Any dispute, controversy, or claim arising out of or relating to this Agreement shall be resolved exclusively through litigation in the state or federal courts located in [Insert State], and both Parties hereby consent to the personal jurisdiction of such courts."
      },
      {
        title: "Intellectual Property",
        text: "All deliverables, reports, and materials prepared under this Agreement shall remain the sole property of the Client. The Service Provider shall have no rights to reuse, republish, or retain copies of such materials without prior written consent."
      },
      {
        title: "Force Majeure",
        text: "Neither Party shall be liable for any delay or failure in performance caused by acts of God, natural disasters, war, terrorism, labor disputes, government actions, or any other event beyond its reasonable control."
      }
    ]
  };

  return (
    <RiskReportPage 
      riskScore={demoData.riskScore}
      summaryText={demoData.summaryText}
      issues={demoData.issues}
      clauses={demoData.clauses}
    />
  );
};

export default App;